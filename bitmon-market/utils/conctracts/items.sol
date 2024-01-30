// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Item is ERC1155, AccessControl, Pausable, ERC1155Burnable {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    string public baseURI =
        "https://testapi.bitmonsternft.com/api/v1/metadata/item/";

    mapping(address => mapping(uint256 => uint256)) public countAmountLock;
    mapping(address => uint256[]) private tokenOwner;
    mapping(address => mapping(uint256 => bool)) private tokenOwnerStatus;

    event eBurnedToGame(
        address indexed from,
        uint256 indexed tokenId,
        uint256 indexed amount
    );

    constructor() ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }

    function uri(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId)));
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        _mint(to, id, amount, "0x00");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, "0x00");
    }

    function getTokensByOwner(address _address)
        public
        view
        returns (uint256[] memory)
    {
        return tokenOwner[_address];
    }

    function lock(
        address wallet,
        uint256 tokenId,
        uint256 amount
    ) public onlyRole(LOCKER_ROLE) {
        require(
            countAmountLock[wallet][tokenId] + amount <=
                balanceOf(wallet, tokenId),
            "Value is over balance"
        );
        countAmountLock[wallet][tokenId] =
            countAmountLock[wallet][tokenId] +
            amount;
    }

    function unlock(
        address wallet,
        uint256 tokenId,
        uint256 amount
    ) public onlyRole(LOCKER_ROLE) {
        require(
            countAmountLock[wallet][tokenId] - amount >= 0,
            "Value is wrong"
        );
        countAmountLock[wallet][tokenId] =
            countAmountLock[wallet][tokenId] -
            amount;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        for (uint256 index = 0; index < ids.length; index++) {
            if (!tokenOwnerStatus[to][ids[index]]) {
                tokenOwnerStatus[to][ids[index]] = true;
                tokenOwner[to].push(ids[index]);
            }
        }
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function redeemNFT(uint256 tokenId, uint256 amount) public {
        super._burn(msg.sender, tokenId, amount);
        emit eBurnedToGame(msg.sender, tokenId, amount);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal override {
        require(
            countAmountLock[from][id] + amount <= balanceOf(from, id),
            "Amount is over limit"
        );
        super._safeTransferFrom(from, to, id, amount, data);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}