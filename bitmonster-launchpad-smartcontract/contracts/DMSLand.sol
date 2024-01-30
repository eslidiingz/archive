// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract DMSLand is
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Land {
        address owner;
        uint256 zone;
        uint256 typeId;
        uint256 tokenId; // zone*10^6 + type*10^4 + y
        uint256 price;
        bool isLocked;
        bool isOwned;
    }

    using SafeMathUpgradeable for uint256;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    mapping(uint256 => Land) allLands;
    mapping(address => uint256[]) ownedLands;

    //typeId => uri
    mapping(uint256 => string) mapUri;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(LOCKER_ROLE, msg.sender);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause()
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlyRole(PAUSER_ROLE)
    {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    )
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        whenNotPaused
    {
        require(allLands[tokenId].isLocked == false, "Land: Token locked");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function burn(uint256 tokenId) public whenNotPaused {
        require(msg.sender == ownerOf(tokenId), "Land: not owner");
        _burn(tokenId);
    }

    // frequently use

    function setMapUri(uint256 _typeId, string memory _uri)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mapUri[_typeId] = _uri;
    }

    function safeMint(
        address _owner,
        uint256 _typeId,
        uint256 _tokenId
    ) public whenNotPaused {
        string memory _tokenUri = mapUri[_typeId];
        _safeMint(_owner, _tokenId);
        _setTokenURI(_tokenId, _tokenUri);
    }

    function createLand(
        address _owner,
        uint256 _zone,
        uint256 _typeId,
        uint256 _tokenId,
        uint256 _price
    ) public whenNotPaused {
        allLands[_tokenId] = Land(
            _owner,
            _zone,
            _typeId,
            _tokenId,
            _price,
            false,
            true
        );
        ownedLands[_owner].push(_tokenId);
    }

    function lockLand(uint256 _tokenId, bool status)
        public
        onlyRole(LOCKER_ROLE)
    {
        allLands[_tokenId].isLocked = status;
    }

    function updateOwner(
        address _currentOwner,
        address _newOwner,
        uint256 _tokenId
    ) public {
        require(
            allLands[_tokenId].owner == _currentOwner,
            "The asset is owned by others"
        );
        allLands[_tokenId].owner = _newOwner;

        for (uint256 i = 0; i < ownedLands[_currentOwner].length; i++) {
            if (_tokenId == ownedLands[_currentOwner][i]) {
                ownedLands[_newOwner].push(_tokenId);
                ownedLands[_currentOwner][i] = ownedLands[_currentOwner][
                    ownedLands[_currentOwner].length - 1
                ];
                ownedLands[_currentOwner].pop();
            }
        }
    }

    function getLandByTokenId(uint256 _tokenId)
        public
        view
        returns (Land memory)
    {
        return allLands[_tokenId];
    }

    function getLandByOwner(address _owner)
        public
        view
        returns (Land[] memory)
    {
        Land[] memory _lands = new Land[](ownedLands[_owner].length);

        for (uint256 i = 0; i < ownedLands[_owner].length; i++) {
            _lands[i] = allLands[ownedLands[_owner][i]];
        }
        return _lands;
    }
}
