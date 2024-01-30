//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./OracleWrapper.sol";

contract StorageCard is AccessControl, OracleWrapper, ReentrancyGuard {
    bytes32 public constant DEV_ROLE = keccak256("DEV_ROLE");
    
    bytes32 public constant WITHDRAW_TYPEHASH = keccak256("withdraw(uint256 tokenId, uint256 nonce, bytes memory signature)");

    address private _cardAddress;

    constructor(address _erc721) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEV_ROLE, msg.sender);

        _setOracleSigner(msg.sender);
        setCardAddress(_erc721);
    }

    function setCardAddress(address _erc721) public onlyRole(DEV_ROLE) {
        _cardAddress = _erc721;
    }

    function withdraw(uint256 tokenId, uint256 nonce, bytes memory signature)
        external
        onlySignerWithUint256(WITHDRAW_TYPEHASH, tokenId, nonce, signature)
        nonReentrant
    {
        require(IERC721(_cardAddress).ownerOf(tokenId) == address(this), "Storage: Token is not valid");

        IERC721(_cardAddress).approve(address(this), tokenId);
        IERC721(_cardAddress).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
        public
        virtual
        returns (bytes4)
    {
        return this.onERC721Received.selector;
    }

}