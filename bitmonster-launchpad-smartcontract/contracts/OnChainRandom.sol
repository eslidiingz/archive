// SPDX-License-Identifier: BUSL-1.1 (Business Source License 1.1)

//--------------------------------------------------------------------------//
// Copyright 2022 serial-coder: Phuwanai Thummavet (mr.thummavet@gmail.com) //
//--------------------------------------------------------------------------//

pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// For an off-chain message signing, please refer to Ethers.js docs:
//   https://docs.ethers.io/v5/single-page/#/v5/api/signer/-%23-Signer-signTypedData

interface IOnChainRandom {
    struct UserEntropy {
        address userAddr;
        uint256 userNonce;
        // To create userSig:
        //     userSig = user.signTypedData(
        //         domainSeparator |
        //         USER_ENTROPY_TYPE_HASH |
        //         userAddr |
        //         userNonce)
        bytes userSig;
    }

    struct AuthorityEntropy {
        bytes userSig;
        address requestorContractAddr; // Contract address authorized to execute the random() function
        uint256 expirationTime;
        // To create authoritySig:
        //     authoritySig = authority.signTypedData(
        //         domainSeparator |
        //         AUTHORITY_ENTROPY_TYPE_HASH |
        //         keccak256(userSig) |
        //         requestorContractAddr |
        //         expirationTime
        //     )
        bytes authoritySig;
    }

    function authority() external view returns (address _authority);

    function userNonces(address _user)
        external
        view
        returns (uint256 _userNonce);

    function changeAuthority(address _newAuthority) external;

    function random(
        UserEntropy calldata _userEntropy,
        AuthorityEntropy calldata _authorityEntropy
    ) external returns (uint256 _result);
}

contract OnChainRandom is IOnChainRandom, Context, Ownable, EIP712 {
    address public authority; // Back-end service address
    mapping(address => uint256) public userNonces;

    string public constant NAME = "OnChainRandom";
    string public constant VERSION = "1";

    bytes32 private constant USER_ENTROPY_TYPE_HASH =
        keccak256("UserEntropy(address userAddr,uint256 userNonce)");

    bytes32 private constant AUTHORITY_ENTROPY_TYPE_HASH =
        keccak256(
            "AuthorityEntropy(bytes32 userSigHash,address requestorContractAddr,uint256 expirationTime)"
        );

    event AuthorityChanged(
        address indexed oldAuthority,
        address indexed newAuthority
    );

    event Random(
        UserEntropy indexed userEntropy,
        AuthorityEntropy authorityEntropy,
        uint256 indexed blockNumber,
        bytes32 indexed prevBlockHash,
        uint256 blockTimestamp,
        uint256 result
    );

    constructor(address _authority) EIP712(NAME, VERSION) {
        require(
            _authority != address(0),
            "_authority cannot be a zero address"
        );
        authority = _authority;
        emit AuthorityChanged(address(0), _authority);
    }

    function changeAuthority(address _newAuthority) external onlyOwner {
        require(
            _newAuthority != address(0),
            "_newAuthority cannot be a zero address"
        );
        emit AuthorityChanged(authority, _newAuthority);
        authority = _newAuthority;
    }

    function random(
        UserEntropy calldata _userEntropy,
        AuthorityEntropy calldata _authorityEntropy
    ) external returns (uint256 _result) {
        require(
            _authorityEntropy.requestorContractAddr == _msgSender(),
            "Invalid requestor"
        );
        require(
            _userEntropy.userAddr == tx.origin &&
                _userEntropy.userAddr !=
                _authorityEntropy.requestorContractAddr,
            "Invalid user"
        );
        require(
            _userEntropy.userAddr != authority,
            "Authority cannot be the user"
        );
        require(
            _userEntropy.userNonce == userNonces[_userEntropy.userAddr],
            "Invalid nonce"
        );
        require(
            keccak256(_userEntropy.userSig) ==
                keccak256(_authorityEntropy.userSig),
            "Signature payloads mismatch"
        );
        require(
            block.timestamp < _authorityEntropy.expirationTime,
            "Payload is expired"
        );

        // Verify the user entropy
        address user = _verifyUserEntropy(_userEntropy);
        require(user != address(0), "Invalid signature");
        require(
            user == _userEntropy.userAddr,
            "User is not the same as the entropy signer"
        );
        userNonces[user]++;

        // Verify the authority entropy
        address authority_ = _verifyAuthorityEntropy(_authorityEntropy);
        require(authority_ != address(0), "Invalid signature");
        require(
            authority_ == authority,
            "Authority is not the same as the entropy signer"
        );

        // Compute the random number
        _result = _computeRandom(_userEntropy, _authorityEntropy);

        bytes32 prevBlockHash = blockhash(block.number - 1);
        emit Random(
            _userEntropy,
            _authorityEntropy,
            block.number,
            prevBlockHash,
            block.timestamp,
            _result
        );
    }

    function _verifyUserEntropy(UserEntropy calldata _userEntropy)
        private
        view
        returns (address)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    USER_ENTROPY_TYPE_HASH,
                    _userEntropy.userAddr,
                    _userEntropy.userNonce
                )
            )
        );
        return ECDSA.recover(digest, _userEntropy.userSig);
    }

    function _verifyAuthorityEntropy(
        AuthorityEntropy calldata _authorityEntropy
    ) private view returns (address) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    AUTHORITY_ENTROPY_TYPE_HASH,
                    keccak256(_authorityEntropy.userSig),
                    _authorityEntropy.requestorContractAddr,
                    _authorityEntropy.expirationTime
                )
            )
        );
        return ECDSA.recover(digest, _authorityEntropy.authoritySig);
    }

    function _computeRandom(
        UserEntropy calldata _userEntropy,
        AuthorityEntropy calldata _authorityEntropy
    ) private view returns (uint256) {
        bytes32 prevBlockHash = blockhash(block.number - 1);
        uint256 blockTimestamp = block.timestamp;

        bytes memory salted = abi.encodePacked(
            prevBlockHash,
            blockTimestamp,
            keccak256(_userEntropy.userSig),
            keccak256(_authorityEntropy.authoritySig)
        );
        return uint256(keccak256(salted));
    }
}
