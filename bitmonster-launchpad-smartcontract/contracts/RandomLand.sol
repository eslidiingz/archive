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

interface IDMSLand {
    function createLand(
        address _owner,
        uint256 _zone,
        uint256 _typeId,
        uint256 _tokenId,
        uint256 _price
    ) external;

    function safeMint(
        address _owner,
        uint256 _typeId,
        uint256 _tokenId
    ) external;
}

contract RandomLand is
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    struct Type {
        string typeName;
        uint256 zone;
        uint256[] y;
        bool isOpen;
        bool isExist;
    }

    event claimed(
        address owner,
        string package,
        uint256 zone,
        uint256 typeId,
        uint256 tokenId
    );

    event bought(address owner, uint256 tokenId, uint256 price);

    IChainSeed chainSeed;
    IDMSLand dmsLand;

    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    uint256[] typesId; // 1,2,3,4,5
    uint256[] zones;
    address public recipientWallet;
    mapping(uint256 => Type) types;
    mapping(uint256 => uint256) zonePrice;
    // owner => package => amount
    mapping(address => mapping(uint256 => uint256)) public launchpadList;

    constructor(
        address _chainSeed,
        address _dmsland,
        address _recipientWallet
    ) {
        chainSeed = IChainSeed(_chainSeed);
        dmsLand = IDMSLand(_dmsland);
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

    function setType(
        uint256 _typeId,
        string memory _typeName,
        uint256 _zone,
        uint256[] memory _y
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(types[_typeId].isExist == false, "Type: already exist");
        require(_y.length != 0, "Lists don't have any member.");

        types[_typeId] = Type(_typeName, _zone, _y, false, true);
        typesId.push(_typeId);
        for (uint256 i = 0; i < zones.length; i++) {
            if (_zone != zones[i]) {
                zones.push(_zone);
            }
        }
    }

    function openType(uint256 _typeId, bool open)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        types[_typeId].isOpen = open;
    }

    function setRecipientWallet(address _wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(address(0) == _wallet, "Non Zero Address");
        recipientWallet = _wallet;
    }

    function setLaunchpadList(
        address _owner,
        uint256 _package,
        uint256 _amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        launchpadList[_owner][_package] = _amount;
        // package 0=random, 1 = crystal
    }

    function setLandPrice(uint256 _zone, uint256 _price)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_price > 0, "Non Zero Price");
        zonePrice[_zone] = _price;
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

    function getTokenId(
        uint256 _zone,
        uint256 _typeId,
        uint256 _random
    ) private whenNotPaused returns (uint256) {
        uint256 _selectedY;
        uint256 _index;

        if (types[_typeId].y.length > 1) {
            _index = _random.mod(types[_typeId].y.length);
            _selectedY = types[_typeId].y[_index];
            types[_typeId].y[_index] = types[_typeId].y[
                types[_typeId].y.length - 1
            ];
            types[_typeId].y.pop();
        } else if (
            types[_typeId].y.length <= 1 && types[_typeId].y[0] != 1000
        ) {
            _index = 0;
            _selectedY = types[_typeId].y[_index];
            types[_typeId].y[0] = 1000;
        } else if (
            types[_typeId].y.length <= 1 && types[_typeId].y[0] == 1000
        ) {
            revert();
        }
        return ((_zone.mul(10**6)).add(_typeId.mul(10**4))).add(_selectedY);
    }

    function claimSpecifiedLand(
        address _owner,
        uint256 _zone,
        uint256 _typeId,
        uint256 _package
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(launchpadList[_owner][_package] > 0, "User owns the asset");
        require(types[_typeId].isExist == true, "Type: doesn't exist");
        require(types[_typeId].isOpen == true, "Type: doesn't open");
        //claim
        launchpadList[_owner][_typeId] = launchpadList[_owner][_typeId] - 1;
        // mint
        uint256 _random = getRandomNumber();
        uint256 _tokenId = getTokenId(_zone, _typeId, _random);
        dmsLand.safeMint(_owner, _typeId, _tokenId);
        // record

        dmsLand.createLand(_owner, _zone, _typeId, _tokenId, zonePrice[_zone]);

        emit claimed(_owner, "Special", _zone, _typeId, _tokenId);
    }

    function claimRandomLand(
        address _owner,
        uint256 _zone,
        uint256[] memory _typesId,
        uint256 _package
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(launchpadList[_owner][_package] > 0, "User owns the asset");

        for (uint256 i = 0; i < _typesId.length; i++) {
            require(
                types[_typesId[i]].isExist == true,
                "Type: don't already exist"
            );
            require(types[_typesId[i]].isOpen == true, "Type: isn't open");
        }
        //claim
        launchpadList[_owner][_package] = launchpadList[_owner][_package] - 1;
        // mint
        uint256 _random = getRandomNumber();
        uint256 _selectedType = _typesId[_random.mod(_typesId.length)];
        uint256 _tokenId = getTokenId(_zone, _selectedType, _random);
        dmsLand.safeMint(_owner, _selectedType, _tokenId);
        // record
        dmsLand.createLand(
            _owner,
            _zone,
            _selectedType,
            _tokenId,
            zonePrice[_zone]
        );

        emit claimed(_owner, "Random", _zone, _selectedType, _tokenId);
    }

    function buyLand(address token, uint256 _zone)
        public
        whenNotPaused
        nonReentrant
    {
        IERC20Upgradeable _token = IERC20Upgradeable(token);
        for (uint256 i = 0; i < typesId.length; i++) {
            require(
                types[typesId[i]].isExist == true,
                "Type: don't already exist"
            );
            require(types[typesId[i]].isOpen == true, "Type: isn't open");
        }
        require(
            _token.balanceOf(msg.sender) >= zonePrice[_zone],
            "Token: not enough"
        );

        //buy
        _token.safeTransferFrom(msg.sender, recipientWallet, zonePrice[_zone]);
        // mint
        uint256 _random = getRandomNumber();
        uint256 _selectedType = typesId[_random.mod(typesId.length)];
        uint256 _tokenId = getTokenId(_zone, _selectedType, _random);
        dmsLand.safeMint(msg.sender, _selectedType, _tokenId);
        // record
        dmsLand.createLand(
            msg.sender,
            _zone,
            _selectedType,
            _tokenId,
            zonePrice[_zone]
        );

        emit bought(msg.sender, _tokenId, zonePrice[_zone]);
    }
}
