//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Monster is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Pausable,
    AccessControl,
    ERC721Burnable
{
    using Counters for Counters.Counter;
    string public baseURI =
        "https://testapi.bitmonsternft.com/api/v1/metadata/monster/";

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    Counters.Counter private _tokenIdCounter;

    // Events
    event eMintedMonster(
        address indexed to,
        uint256 indexed monsterId,
        uint256 indexed tokenId,
        string subfixUri
    );
    event eBurnedToGame(
        address indexed from,
        uint256 indexed tokenId,
        uint256 indexed monsterId
    );

    mapping(uint256 => uint256) public monsterDetail;
    mapping(uint256 => bool) public lockToken;

    constructor() ERC721("BitmonsterMonster", "Monster") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }

    function safeMint(address to, uint256 monsterId)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(
            tokenId,
            string(abi.encodePacked(baseURI, Strings.toString(monsterId)))
        );

        monsterDetail[tokenId] = monsterId;
        lockToken[tokenId] = false;
        emit eMintedMonster(
            to,
            monsterId,
            tokenId,
            string(Strings.toString(monsterId))
        );

        return tokenId;
    }

    function lock(uint256 tokenId, bool status) public onlyRole(LOCKER_ROLE) {
        lockToken[tokenId] = status;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(!lockToken[tokenId], "Token is lock!!");
        super._transfer(from, to, tokenId);
    }

    function redeemNFT(uint256 tokenId) public {
        _burn(tokenId);
        emit eBurnedToGame(msg.sender, tokenId, monsterDetail[tokenId]);
    }

    function getTokensByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenId = new uint256[](balance);
        for (uint256 index = 0; index < balance; index++) {
            tokenId[index] = uint256(tokenOfOwnerByIndex(owner, index));
        }

        return tokenId;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
