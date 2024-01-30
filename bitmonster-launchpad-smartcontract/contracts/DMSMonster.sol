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
import "@openzeppelin/contracts/utils/Counters.sol";

contract DMSMonster is
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Monster {
        address owner;
        uint256 rankId;
        uint256 monsterId;
        string monsterName;
        uint256 tokenId;
        uint256 price;
        bool isLocked;
        bool isOwned;
    }

    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    using SafeMathUpgradeable for uint256;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    mapping(uint256 => Monster) public allMonsters;
    mapping(address => uint256[]) public ownedMonsters;

    // monsterId => uri
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
        require(
            allMonsters[tokenId].isLocked == false,
            "Monster: Token locked"
        );
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
        require(msg.sender == ownerOf(tokenId), "Monster: not owner");
        _burn(tokenId);
    }

    // frequently use

    function setMapUri(uint256 _monsterId, string memory _uri)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mapUri[_monsterId] = _uri;
    }

    function safeMint(address _owner, uint256 _monsterId)
        public
        whenNotPaused
        returns (uint256)
    {
        uint256 _tokenId = tokenIdCounter.current();
        string memory _tokenUri = mapUri[_monsterId];
        _safeMint(_owner, _tokenId);
        _setTokenURI(_tokenId, _tokenUri);
        tokenIdCounter.increment();

        return _tokenId;
    }

    function createMonster(
        address _owner,
        uint256 _rankId,
        uint256 _monsterId,
        string memory _monsterName,
        uint256 _tokenId,
        uint256 _price
    ) public whenNotPaused {
        allMonsters[_tokenId] = Monster(
            _owner,
            _rankId,
            _monsterId,
            _monsterName,
            _tokenId,
            _price,
            false,
            true
        );
        ownedMonsters[_owner].push(_tokenId);
    }

    function lockMonster(uint256 _tokenId, bool status)
        public
        onlyRole(LOCKER_ROLE)
    {
        allMonsters[_tokenId].isLocked = status;
    }

    function updateOwner(
        address _currentOwner,
        address _newOwner,
        uint256 _tokenId
    ) public {
        require(
            allMonsters[_tokenId].owner == _currentOwner,
            "The asset is owned by others"
        );
        allMonsters[_tokenId].owner = _newOwner;
        for (uint256 i = 0; i < ownedMonsters[_currentOwner].length; i++) {
            if (_tokenId == ownedMonsters[_currentOwner][i]) {
                ownedMonsters[_newOwner].push(_tokenId);
                ownedMonsters[_currentOwner][i] = ownedMonsters[_currentOwner][
                    ownedMonsters[_currentOwner].length - 1
                ];
                ownedMonsters[_currentOwner].pop();
            }
        }
    }

    function getMonsterByTokenId(uint256 _tokenId)
        public
        view
        returns (Monster memory)
    {
        return allMonsters[_tokenId];
    }

    function getMonsterByOwner(address _owner)
        public
        view
        returns (Monster[] memory)
    {
        Monster[] memory _monsters = new Monster[](
            ownedMonsters[_owner].length
        );

        for (uint256 i = 0; i < ownedMonsters[_owner].length; i++) {
            _monsters[i] = allMonsters[ownedMonsters[_owner][i]];
        }
        return _monsters;
    }
}
