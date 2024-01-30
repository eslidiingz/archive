// SPDX-License-Identifier: Multiverse Expert
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

interface IChainSeed {
    function grantWhitelist(address _owner, bool _active) external;

    function randomSeed() external returns (bytes32 seed);
}

interface IDMSMonster {
    function createMonster(
        address _owner,
        uint256 _rankId,
        uint256 _monsterId,
        string memory _monsterName,
        uint256 _tokenId,
        uint256 _price
    ) external;

    function safeMint(address _owner, uint256 _monsterId)
        external
        returns (uint256);
}

contract RandomMonster is
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Rank {
        string rankName;
        uint256 price;
        uint256[] monsterId;
        string[] monsterName;
        bool isOpen;
        bool isExist;
    }

    event claimed(
        address owner,
        uint256 rankId,
        uint256 monsterId,
        uint256 tokenId,
        uint256 price
    );
    event bought(
        address owner,
        uint256 rankId,
        uint256 monsterId,
        uint256 tokenId,
        uint256 price
    );

    IChainSeed chainSeed;
    IDMSMonster dmsMonster;

    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    uint256[] ranksId; // 1,2,3,4,5
    address public recipientWallet;
    mapping(uint256 => Rank) ranks;
    mapping(address => mapping(uint256 => uint256)) launchpadList;

    constructor(
        address _chainSeed,
        address _dmsmonster,
        address _recipientWallet
    ) {
        chainSeed = IChainSeed(_chainSeed);
        dmsMonster = IDMSMonster(_dmsmonster);
        recipientWallet = _recipientWallet;

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

    function setRank(
        uint256 _rankId,
        string memory _rankName,
        uint256 _price,
        uint256[] memory _monsterId,
        string[] memory _monsterName
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(_rankName).length != 0, "Rank: name is empty");
        require(ranks[_rankId].isExist == false, "Rank: already exist");
        ranks[_rankId] = Rank(
            _rankName,
            _price,
            _monsterId,
            _monsterName,
            false,
            true
        );
        ranksId.push(_rankId);
    }

    function openRank(uint256 _rankId, bool open)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ranks[_rankId].isOpen = open;
    }

    function addMonsterInRank(
        uint256 _rankId,
        uint256[] memory _monsterId,
        string[] memory _monsterName
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(ranks[_rankId].isExist == true, "Rank: don't already exist");
        require(
            _monsterId.length > 0 && _monsterId.length == _monsterName.length,
            "Monster list is empty or they aren't the same"
        );

        for (uint256 i = 0; i < _monsterId.length; i++) {
            ranks[_rankId].monsterId.push(_monsterId[i]);
            ranks[_rankId].monsterName.push(_monsterName[i]);
        }
    }

    function setRecipientWallet(address wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(address(0) == wallet, "Non Zero Address");
        recipientWallet = wallet;
    }

    function setLaunchpadList(
        address _owner,
        uint256 _rankId,
        uint256 _amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        launchpadList[_owner][_rankId] = _amount;
    }

    function getRandomNumber() private whenNotPaused returns (uint256) {
        chainSeed.grantWhitelist(address(this), true);
        bytes32 randomSeed = chainSeed.randomSeed();
        uint256 _random = uint256(
            keccak256(
                abi.encodePacked(
                    "EPIC",
                    block.difficulty,
                    block.timestamp,
                    block.number,
                    block.difficulty,
                    randomSeed
                )
            )
        );
        chainSeed.grantWhitelist(address(this), false);
        return _random;
    }

    function getRandomMonster(uint256 _rankId, uint256 _random)
        private
        view
        whenNotPaused
        returns (uint256, string memory)
    {
        uint256 _index = _random.mod(ranks[_rankId].monsterId.length);
        return (
            ranks[_rankId].monsterId[_index],
            ranks[_rankId].monsterName[_index]
        );
    }

    function claimMonster(uint256 _rankId, address _owner)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(launchpadList[_owner][_rankId] > 0, "User owns the asset");
        require(ranks[_rankId].isExist == true, "Rank: don't already exist");
        require(ranks[_rankId].isOpen == true, "Rank: isn't open");
        //claim
        launchpadList[_owner][_rankId] = launchpadList[_owner][_rankId] - 1;
        // mint
        uint256 _random = getRandomNumber();
        (uint256 _monsterId, string memory _monsterName) = getRandomMonster(
            _rankId,
            _random
        );
        uint256 _tokenId = dmsMonster.safeMint(_owner, _monsterId);
        // record
        dmsMonster.createMonster(
            _owner,
            _rankId,
            _monsterId,
            _monsterName,
            _tokenId,
            ranks[_rankId].price
        );

        emit claimed(
            _owner,
            _rankId,
            _monsterId,
            _tokenId,
            ranks[_rankId].price
        );
    }

    function buyMonster(uint256 _rankId, address token)
        public
        whenNotPaused
        nonReentrant
    {
        IERC20Upgradeable _token = IERC20Upgradeable(token);
        require(ranks[_rankId].isExist == true, "Rank: don't already exist");
        require(ranks[_rankId].isOpen == true, "Rank: isn't open");
        require(
            _token.balanceOf(msg.sender) >= ranks[_rankId].price,
            "Token: not enough"
        );
        // buy
        _token.safeTransferFrom(
            msg.sender,
            recipientWallet,
            ranks[_rankId].price
        );
        // mint
        uint256 _random = getRandomNumber();
        (uint256 _monsterId, string memory _monsterName) = getRandomMonster(
            _rankId,
            _random
        );
        uint256 _tokenId = dmsMonster.safeMint(msg.sender, _monsterId);
        // record
        dmsMonster.createMonster(
            msg.sender,
            _rankId,
            _monsterId,
            _monsterName,
            _tokenId,
            ranks[_rankId].price
        );

        emit bought(
            msg.sender,
            _rankId,
            _monsterId,
            _tokenId,
            ranks[_rankId].price
        );
    }
}
