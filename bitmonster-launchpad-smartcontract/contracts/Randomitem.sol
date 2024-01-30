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

interface IDMSItem {
    function createItem(
        address _owner,
        uint256[] memory _itemId,
        uint256[] memory _amount
    ) external;

    function Mint(
        address _owner,
        uint256[] memory _itemId,
        uint256[] memory _amount
    ) external;
}

contract RandomItem is
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Rank {
        uint256[] itemId;
        bool isOpen;
        bool isExist;
    }

    event claimed(
        address owner,
        uint256 rankId,
        uint256 _itemId,
        uint256 amount
    );
    event bought(
        address owner,
        uint256 rankId,
        uint256 _itemId,
        uint256 amount,
        uint256 price
    );

    IChainSeed chainSeed;
    IDMSItem dmsItem;

    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    address public recipientWallet;
    uint256 itemPrice;
    uint256[] ranksId;
    mapping(uint256 => Rank) ranks;
    // owner => package => amount
    mapping(address => mapping(uint256 => uint256)) public launchpadList;
    uint256[] rate;
    mapping(uint256 => uint256) public selectedRank;

    constructor(
        address _chainSeed,
        address _dmsItem,
        address _recipientWallet
    ) {
        chainSeed = IChainSeed(_chainSeed);
        dmsItem = IDMSItem(_dmsItem);
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

    function setRank(uint256 _rankId, uint256[] memory _itemId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(ranks[_rankId].isExist == false, "Rank: already exist");
        require(_itemId.length != 0, "Lists don't have any member.");
        ranks[_rankId] = Rank(_itemId, false, true);
        ranksId.push(_rankId);
    }

    function openRank(uint256 _rankId, bool _open)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ranks[_rankId].isOpen = _open;
    }

    function addTokenIdInRank(uint256 _rankId, uint256[] memory _itemId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(ranks[_rankId].isExist == true, "Rank doesn't exist");
        require(_itemId.length > 0, "Token: is empty");

        for (uint256 i = 0; i < _itemId.length; i++) {
            ranks[_rankId].itemId.push(_itemId[i]);
        }
    }

    function setRate(uint256 _rate, uint256 _rank)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        selectedRank[_rate] = _rank;
        rate.push(_rate);
    }

    function setRecipientWallet(address _wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(address(0) == _wallet, "Non Zero Address");
        recipientWallet = _wallet;
    }

    function setItemPrice(uint256 _price)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_price > 0, "Non Zero Price");
        itemPrice = _price;
    }

    function setLaunchpadList(
        address _owner,
        uint256 _package,
        uint256 _amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        launchpadList[_owner][_package] = _amount;
        // _package 0=normal, 1=special
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

    function getRank(uint256 _random)
        private
        view
        whenNotPaused
        returns (uint256)
    {
        uint256 _selectedRank;
        uint256 _num = _random.mod(100);
        for (uint256 i = 0; i < rate.length; i++) {
            if (_num < rate[i]) {
                _selectedRank = selectedRank[rate[i]];
                break;
            }
        }

        return _selectedRank;
    }

    function claimItemd(
        address _owner,
        uint256[] memory _ranksId,
        uint256 _package
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(launchpadList[_owner][_package] > 0, "User owns the asset");

        for (uint256 i = 0; i < _ranksId.length; i++) {
            require(
                ranks[_ranksId[i]].isExist == true,
                "Type: don't already exist"
            );
            require(ranks[_ranksId[i]].isOpen == true, "Type: isn't open");
        }
        //claim
        launchpadList[_owner][_package] = launchpadList[_owner][_package] - 1;
        // mint
        uint256 _random = getRandomNumber();
        uint256 _selectedRank = getRank(_random);
        uint256 _selectedItemId = ranks[_selectedRank].itemId[
            _random.mod(ranks[_selectedRank].itemId.length)
        ];
        uint256[] memory _ItemIdarr = new uint256[](1);
        uint256[] memory _ItemAmountarr = new uint256[](1);
        _ItemIdarr[0] = _selectedItemId;
        _ItemAmountarr[0] = 1;
        dmsItem.Mint(_owner, _ItemIdarr, _ItemAmountarr);
        // record
        dmsItem.createItem(_owner, _ItemIdarr, _ItemAmountarr);

        emit claimed(_owner, _selectedRank, _selectedItemId, 1);
    }

    function buyItem(address token) public whenNotPaused nonReentrant {
        IERC20Upgradeable _token = IERC20Upgradeable(token);
        for (uint256 i = 0; i < ranksId.length; i++) {
            require(
                ranks[ranksId[i]].isExist == true,
                "Type: don't already exist"
            );
            require(ranks[ranksId[i]].isOpen == true, "Type: isn't open");
        }
        require(_token.balanceOf(msg.sender) >= itemPrice, "Token: not enough");
        //buy
        _token.safeTransferFrom(msg.sender, recipientWallet, itemPrice);
        // mint
        uint256 _random = getRandomNumber();
        uint256 _selectedRank = getRank(_random);
        uint256 _selectedItemId = ranks[_selectedRank].itemId[
            _random.mod(ranks[_selectedRank].itemId.length)
        ];
        uint256[] memory _ItemIdarr = new uint256[](1);
        uint256[] memory _ItemAmountarr = new uint256[](1);
        _ItemIdarr[0] = _selectedItemId;
        _ItemAmountarr[0] = 1;
        dmsItem.Mint(msg.sender, _ItemIdarr, _ItemAmountarr);
        // record
        dmsItem.createItem(msg.sender, _ItemIdarr, _ItemAmountarr);

        emit bought(msg.sender, _selectedRank, _selectedItemId, 1, itemPrice);
    }
}
