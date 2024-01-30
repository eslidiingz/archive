//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./OracleWrapper.sol";

interface IERC721Extender is IERC721 {
    function burn(uint256 tokenId) external;
    function safeMint(address to, string memory uri) external;
}

/// @custom:security-contact siriwat576@gmail.com
contract OracleCard is AccessControl, OracleWrapper, ReentrancyGuard {
    event OnLocked(address account, uint256 tokenId);
    event OnUnlocked(address account, uint256 tokenId);
    event OnRegistered(address account);
    event OnRedeemed(address account, uint256 tokenId);

    bytes32 public constant DEV_ROLE = keccak256("DEV_ROLE");
    bytes32 public constant MIGRATE_ROLE = keccak256("MIGRATE_ROLE");

    bytes32 public constant REGISTER_TYPEHASH = keccak256("register(uint256 nonce, bytes memory signature)");
    bytes32 public constant WITHDRAW_TYPEHASH = keccak256("withdraw(string memory invoice, uint256 nonce, bytes memory signature)");
    bytes32 public constant REDEEMCARD_TYPEHASH = keccak256("redeemCard(uint256 tokenId, uint256 nonce, bytes memory signature)");
    
    uint256 public constant DEFENDER_DELAY = 0 minutes;

    address private _cardAddress;

    mapping(address => bool) _registeredAccount;
    mapping(address => mapping(uint256 => bool)) _lockedCard; //msg.sender => tokenId => isActive

    bool _isContractActive = true;
    bool _canUnlock = true;

    constructor(address _erc721) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEV_ROLE, msg.sender);

        _setOracleSigner(msg.sender);
        setCardAddress(_erc721);
    }

    modifier isContractActive {
        require(_isContractActive, "Oracle: Contract is not active");
        _;
    }

    modifier onlyRegistered {
        require(_registeredAccount[msg.sender], "Oracle: This account is not yet registered");
        _;
    }

    function setOracleSigner(address _account) public onlyRole(DEV_ROLE) {
        require(address(0) != _account && address(this) != _account, "Oracle: Invalid address");

        _setOracleSigner(_account);
    }

    function setContractActive(bool _toggle) public onlyRole(DEV_ROLE) {
        require(_isContractActive != _toggle, "Oracle: Invalid boolean");

        _isContractActive = _toggle;
    }

    function setCardAddress(address _address) public onlyRole(DEV_ROLE) {
        require(_address != address(0) && _address != address(this), "Oracle: Invalid token");

        _cardAddress = _address;
    }

    function setCanUnlock(bool _toggle) public onlyRole(DEV_ROLE) {
        require(_canUnlock != _toggle, "Oracle: Invalid boolean");

        _canUnlock = _toggle;
    }

    function isRegistered() public view returns(bool) {
        return _registeredAccount[msg.sender];
    }

    function lockedCard(address account, uint256 tokenId) public view returns(bool) {
        return _lockedCard[account][tokenId];
    }

    // FOR MIGRATION PURPOSE
    function revokeLockedCard(address account, uint256 tokenId) public onlyRole(MIGRATE_ROLE) {
        require(_lockedCard[account][tokenId], "Migrate: No locked card");

        IERC721(_cardAddress).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function register(uint256 nonce, bytes memory signature) external onlySigner(REGISTER_TYPEHASH, nonce, signature) isContractActive {
        require(!_registeredAccount[msg.sender], "Oracle: Already registered");

        _registeredAccount[msg.sender] = true;

        emit OnRegistered(msg.sender);
    }

    function lock(uint256 tokenId) external onlyRegistered isContractActive nonReentrant {
        require(IERC721(_cardAddress).ownerOf(tokenId) == msg.sender, "Oracle: Invalid owner");
        require(_lockedCard[msg.sender][tokenId] == false, "Oracle: Token already locked");

        IERC721(_cardAddress).safeTransferFrom(msg.sender, address(this), tokenId);
        _lockedCard[msg.sender][tokenId] = true;
        emit OnLocked(msg.sender, tokenId);
    }

    function unlock(uint256 tokenId) external onlyRegistered isContractActive nonReentrant {
        require(IERC721(_cardAddress).ownerOf(tokenId) == address(this), "Oracle: Invalid owner");
        require(_canUnlock, "Oracle: Unable to unlock");
        require(_lockedCard[msg.sender][tokenId] == true, "Oracle: No token locked");

        IERC721(_cardAddress).safeTransferFrom(address(this), msg.sender, tokenId);
        _lockedCard[msg.sender][tokenId] = false;
        emit OnUnlocked(msg.sender, tokenId);
    }

    function redeemCard(uint256 tokenId, uint256 nonce, bytes memory signature)
        external
        onlyRegistered
        onlySignerWithUint256(REDEEMCARD_TYPEHASH, tokenId, nonce, signature)
        oracleFreeze(DEFENDER_DELAY)
        isContractActive
        nonReentrant
    {
        require(IERC721(_cardAddress).ownerOf(tokenId) == msg.sender, "Oracle: Invalid owner");

        IERC721Extender(_cardAddress).burn(tokenId);
        emit OnRedeemed(msg.sender, tokenId);
    }

    function withdraw(string memory metadata, string memory invoice, uint256 nonce, bytes memory signature) 
        external
        onlyRegistered
        onlySignerInvoiceWithString(WITHDRAW_TYPEHASH, metadata, nonce, invoice, signature)
        oracleFreeze(DEFENDER_DELAY)
        isContractActive
        nonReentrant
    {
        IERC721Extender(_cardAddress).safeMint(msg.sender, metadata);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
        public
        virtual
        returns (bytes4)
    {
        return this.onERC721Received.selector;
    }
}