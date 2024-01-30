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

contract Land is
    ERC721,
    ERC721URIStorage,
    Pausable,
    AccessControl,
    ERC721Burnable,
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    string public baseURI =
        "https://testapi.bitmonsternft.com/api/v1/metadata/land/";

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => bool) public isLand; // zone+code+index available?
    mapping(uint256 => uint256) public tokenIndex; // token return zone+code+index
    mapping(uint256 => bool) public lockToken;
    // Events
    event eMintedLand(
        address indexed to,
        uint256 zone,
        uint256 indexed landId,
        uint256 indexed tokenId,
        string subfixUri
    );

    event eBurnedLandToGame(
        uint256 zone,
        uint256 code,
        uint256 index,
        uint256 indexed tokenId,
        address indexed burner
    );

    constructor() ERC721("BitmonsterLand", "Land") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }

    function getDetailByToken(uint256 token)
        public
        view
        returns (uint256[3] memory)
    {
        require(tokenIndex[token] > 0, "token is not data");
        //zone,code,index
        return [
            tokenIndex[token] / 1000,
            (tokenIndex[token] % 1000) / 100,
            tokenIndex[token] % 100
        ];
    }

    function safeMint(
        address to,
        uint256 zone,
        uint256 landId
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 code = landId / 100;
        uint256 index = landId % 100;

        //check land
        uint256 _landId = (zone * 1000) + (code * 100) + index;
        require(!isLand[_landId], "Land unavailable");

        isLand[_landId] = true;
        uint256 tokenId = _tokenIdCounter.current();
        tokenIndex[tokenId] = _landId;
        lockToken[tokenId] = false;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(
            tokenId,
            string(abi.encodePacked(baseURI, Strings.toString(_landId)))
        );

        emit eMintedLand(
            to,
            zone,
            landId,
            tokenId,
            string(Strings.toString(_landId))
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
        emit eBurnedLandToGame(
            tokenIndex[tokenId] / 1000,
            (tokenIndex[tokenId] % 1000) / 100,
            tokenIndex[tokenId] % 100,
            tokenId,
            msg.sender
        );
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
        isLand[tokenIndex[tokenId]] = false;
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
