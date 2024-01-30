//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Nonce {
    using ECDSA for bytes32;
    address private _signer;

    bool internal _bEnableSequence = false;
    mapping(address => mapping(uint256 => bool)) _nonces;
    mapping(address => uint256) private _timestamp;
    mapping(address => mapping(string => bool)) _invoices;
    mapping(address => uint256) private _sequence;

    function isUsedNonce(uint256 nonce) public view returns (bool) {
        return _nonces[msg.sender][nonce];
    }

    function _enableSequence(bool _trigger) internal {
        _bEnableSequence = _trigger;
    }

    function isUsedInvoice(string calldata invoice) public view returns (bool) {
        return _invoices[msg.sender][invoice];
    }

    function getSequenceNonce(address sender) public view returns(uint256) {
        return _sequence[sender];
    }

    function _getSigner(bytes32 _payload, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        return bytes32(_payload).toEthSignedMessageHash().recover(_signature);
    }

    function _setOracleSigner(address _account) internal {
        require(
            _account != address(0) && _account != address(this),
            "Oracle: Invalid operator"
        );

        _signer = address(_account);
    }

    function _validate(
        bytes32 _payload,
        uint256 _nonce,
        bytes memory _signature
    ) private view returns (bool) {
        require(!_nonces[msg.sender][_nonce], "Oracle: Invalid nonce");
        if(_bEnableSequence) require(_nonce == _sequence[msg.sender], "Oracle: Invalid sequence");

        address account = _getSigner(_payload, _signature);
        return
            account == _signer &&
            account != address(0) &&
            account != address(this);
    }

    modifier onlySigner(
        bytes32 _identity,
        uint256 _nonce,
        bytes memory _signature
    ) {
        bytes32 message = keccak256(
            abi.encodePacked(this, _identity, msg.sender, "", _nonce)
        );
        require(
            _validate(message, _nonce, _signature),
            "Oracle: No permission"
        );
        _;
        _nonces[msg.sender][_nonce] = true;
        _timestamp[msg.sender] = block.timestamp;
        if(_bEnableSequence) _sequence[msg.sender]++;
    }

    modifier onlySignerWithUint256(
        bytes32 _identity,
        uint256 _value,
        uint256 _nonce,
        bytes memory _signature
    ) {
        bytes32 digest = keccak256(
            abi.encodePacked(this, _identity, msg.sender, _value, _nonce)
        );
        require(_validate(digest, _nonce, _signature), "Oracle: No permission");
        _;
        _nonces[msg.sender][_nonce] = true;
        _timestamp[msg.sender] = block.timestamp;
        if(_bEnableSequence) _sequence[msg.sender]++;
    }
    modifier onlySignerWithUint256TwoValue(
        bytes32 _identity,
        uint256 _value1,
        uint256 _value2,
        uint256 _nonce,
        bytes memory _signature
    ) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                this,
                _identity,
                msg.sender,
                _value1,
                _value2,
                _nonce
            )
        );
        require(_validate(digest, _nonce, _signature), "Oracle: No permission");
        _;
        _nonces[msg.sender][_nonce] = true;
        _timestamp[msg.sender] = block.timestamp;
        if(_bEnableSequence) _sequence[msg.sender]++;
    }

    modifier onlySignerInvoiceWithUint256(
        bytes32 _identity,
        uint256 _value,
        uint256 _nonce,
        string memory _invoice,
        bytes memory _signature
    ) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                this,
                _identity,
                msg.sender,
                _value,
                _nonce,
                _invoice
            )
        );
        require(_validate(digest, _nonce, _signature), "Oracle: No permission");
        require(
            _invoices[msg.sender][_invoice] == false,
            "Oracle: Invalid invoice"
        );
        _;
        _nonces[msg.sender][_nonce] = true;
        _invoices[msg.sender][_invoice] = true;
        _timestamp[msg.sender] = block.timestamp;
        if(_bEnableSequence) _sequence[msg.sender]++;
    }

    modifier onlySignerInvoiceWithString(
        bytes32 _identity,
        string memory _value,
        uint256 _nonce,
        string memory _invoice,
        bytes memory _signature
    ) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                this,
                _identity,
                msg.sender,
                _value,
                _nonce,
                _invoice
            )
        );
        require(_validate(digest, _nonce, _signature), "Oracle: No permission");
        require(
            _invoices[msg.sender][_invoice] == false,
            "Oracle: Invalid invoice"
        );
        _;
        _nonces[msg.sender][_nonce] = true;
        _invoices[msg.sender][_invoice] = true;
        _timestamp[msg.sender] = block.timestamp;
        if(_bEnableSequence) _sequence[msg.sender]++;
    }

    modifier oracleFreeze(uint256 timeDiff) {
        uint256 lastTransaction = _timestamp[msg.sender];
        uint256 diff = block.timestamp - lastTransaction;

        require(diff >= timeDiff, "Oracle: Try again later");
        _;
    }
}
