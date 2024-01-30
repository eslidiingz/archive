//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface IBusd {
    function balanceOf(address _addr) external view returns (uint256);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external;
}

interface IMonster {
    function safeMint(address to, uint256 monsterId) external returns (uint256);
}

interface ILand {
    function safeMint(
        address to,
        uint256 zone,
        uint256 landId
    ) external returns (uint256);
}

interface IItem {
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external;

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external;

    function grantRole(bytes32 role, address account) external;
}

interface IWhitelistMysteryBox {
    function decrementAmountWhitelist(
        address _address,
        string memory _typeBox,
        string memory _box
    ) external;

    function getWhitelist(
        address _address,
        string memory _typeBox,
        string memory _box
    ) external view returns (uint256);
}

contract MysteryBoxV1 is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using StringsUpgradeable for uint256;
    // monster
    struct MonsterBox {
        uint256 price;
        uint256[] monsterId;
        uint256 monsterBalance;
        bool isOpen;
        bool isCreate;
    }
    mapping(string => MonsterBox) private mysteryMonster; // type => data
    mapping(string => mapping(uint256 => uint256)) monsterAmount; // type => monsterId => amount

    // land
    struct LandBox {
        uint256 price;
        uint256[] landId;
        bool isOpen;
        bool isCreate;
    }
    mapping(uint256 => LandBox) private mysteryLand; // zone => data

    // item
    struct ItemBox {
        uint256 price;
        uint256[] keyItemId; // percent min to max ex(40,70,100)
        bool isOpen;
        bool isCreate;
    }
    mapping(uint256 => ItemBox) private mysteryItem; // boxNumber => data
    mapping(uint256 => mapping(uint256 => uint256[])) itemId; // boxNumber => key => itemId[] **itemId length same ItemBox.keyItemId
    uint256 public openItemBox;

    // global
    address public addressRecipient;
    address public addressToken;
    address public addressMonster;
    address public addressLand;
    address public addressItem;
    address public addressWhitelistMysteryBox;

    // Events
    event eOpenGachaMonster(
        string indexed boxType,
        uint256 price,
        uint256 indexed monsterId,
        uint256 indexed tokenId
    );
    event eOpenGachaLand(
        uint256 indexed zone,
        uint256 price,
        uint256 indexed landId,
        uint256 indexed tokenId
    );
    event eOpenGachaItem(
        uint256 indexed boxType,
        uint256 indexed price,
        uint256 indexed itemId
    );

    bytes32 public constant TYPE_BUY = keccak256("TYPE_BUY");
    bytes32 public constant TYPE_WHITELIST = keccak256("TYPE_WHITELIST");

    function initialize(
        address recipient,
        address tokenBUSD,
        address monster,
        address land,
        address item,
        address whitelist
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        addressRecipient = recipient;
        addressToken = tokenBUSD;
        addressMonster = monster;
        addressLand = land;
        addressItem = item;
        addressWhitelistMysteryBox = whitelist;
    }

    // global function
    function checkOnOpenMysteryBox(
        bytes32 openType,
        uint256 price,
        string memory typeBox,
        string memory box
    ) private {
        // choose type
        if (openType == TYPE_BUY) {
            // check token and transfer
            require(
                IBusd(addressToken).balanceOf(msg.sender) >= price,
                string(
                    abi.encodePacked(
                        "TOKEN <= ",
                        StringsUpgradeable.toString(price)
                    )
                )
            );
            IBusd(addressToken).transferFrom(
                msg.sender,
                addressRecipient,
                price
            );
        } else if (openType == TYPE_WHITELIST) {
            // check whitelist and update whitelist
            require(
                IWhitelistMysteryBox(addressWhitelistMysteryBox).getWhitelist(
                    msg.sender,
                    typeBox,
                    box
                ) > 0,
                "Whitelist balance amount is zero!!"
            );
            IWhitelistMysteryBox(addressWhitelistMysteryBox)
                .decrementAmountWhitelist(msg.sender, typeBox, box);
        } else {
            revert("openType is wrong!!");
        }
    }

    // monster function for owner
    function createMonsterBox(
        string memory box,
        uint256 price,
        uint256[] memory monsterId,
        uint256[] memory monsterLimit,
        uint256 monsterBalance,
        bool isOpen
    ) public onlyOwner {
        require(!mysteryMonster[box].isCreate, "MysteryBox not recreate!!");
        require(
            monsterId.length == monsterLimit.length,
            "Monster id and amount not match!!"
        );
        mysteryMonster[box] = MonsterBox({
            price: price,
            monsterId: monsterId,
            monsterBalance: monsterBalance,
            isOpen: isOpen,
            isCreate: true
        });
        for (uint256 i = 0; i < monsterId.length; i++) {
            monsterAmount[box][monsterId[i]] = monsterLimit[i];
        }
    }

    function updateMonsterInBox(
        string memory box,
        uint256[] memory monsterId,
        uint256[] memory monsterLimit,
        uint256 monsterBalance
    ) public onlyOwner {
        require(mysteryMonster[box].isCreate, "MysteryBox not create!!");
        require(!mysteryMonster[box].isOpen, "MysteryBox is open!!");
        mysteryMonster[box].monsterId = monsterId;
        mysteryMonster[box].monsterBalance = monsterBalance;
        for (uint256 i; i < monsterId.length; i++) {
            monsterAmount[box][monsterId[i]] = monsterLimit[i];
        }
    }

    function updatePriceMonsterInBox(string memory box, uint256 price)
        public
        onlyOwner
    {
        require(mysteryMonster[box].isCreate, "MysteryBox not create!!");
        require(!mysteryMonster[box].isOpen, "MysteryBox is open!!");
        mysteryMonster[box].price = price;
    }

    function updateIsOpenMonsterBox(string memory box, bool isOpen)
        public
        onlyOwner
    {
        require(mysteryMonster[box].isCreate, "box is wrong!!");
        mysteryMonster[box].isOpen = isOpen;
    }

    function getMysteryMonster(string memory box)
        public
        view
        returns (MonsterBox memory)
    {
        return mysteryMonster[box];
    }

    // monster function for user | openType[BUY,WHITELIST]
    function gachaMonster(string memory box, bytes32 openType, address userAddr)
        public
        nonReentrant
    {
        // check myterybox
        require(mysteryMonster[box].isOpen, "MysteryBox not open!!");
        require(
            mysteryMonster[box].monsterId.length > 0,
            "MysteryBox is empty"
        );
        require(mysteryMonster[box].price > 0, "MysteryBox price wrong");

        // choose type [check token and transfer, check whitelist and update whitelist]
        checkOnOpenMysteryBox(
            openType,
            mysteryMonster[box].price,
            "MONSTER",
            box
        );

        // random monster
        uint256 indexMonsterId = uint256(
            keccak256(
                abi.encodePacked(
                    "BitmonsterNFT",
                    block.difficulty,
                    block.timestamp,
                    block.number,
                    block.difficulty,
                    msg.sender
                )
            )
        ) % mysteryMonster[box].monsterId.length;
        uint256 resultMonsterId = mysteryMonster[box].monsterId[indexMonsterId];

        // decrement data
        require(
            monsterAmount[box][resultMonsterId] - 1 >= 0,
            "MysteryBox data error!!"
        );
        monsterAmount[box][resultMonsterId] =
            monsterAmount[box][resultMonsterId] -
            1;
        if (monsterAmount[box][resultMonsterId] == 0) {
            // if indexMonsterId is not last
            if (
                mysteryMonster[box].monsterId[indexMonsterId] <
                mysteryMonster[box].monsterId.length - 1
            ) {
                // set value last to value zero
                mysteryMonster[box].monsterId[indexMonsterId] = mysteryMonster[
                    box
                ].monsterId[mysteryMonster[box].monsterId.length - 1];
            }

            // pop data
            mysteryMonster[box].monsterId.pop();
        }
        require(
            mysteryMonster[box].monsterBalance - 1 >= 0,
            "monsterBalance is wrong!!"
        );
        mysteryMonster[box].monsterBalance =
            mysteryMonster[box].monsterBalance -
            1;

        // mint NFT
        if ( userAddr == msg.sender ) {
                uint256 tokenId = IMonster(addressMonster).safeMint(
                msg.sender,
                resultMonsterId
            );    
        } else {
                 uint256 tokenId = IMonster(addressMonster).safeMint(
                userAddr,
                resultMonsterId
            );    
        }
        
        emit eOpenGachaMonster(
            box,
            mysteryMonster[box].price,
            resultMonsterId,
            tokenId
        );
    }

    // land function for owner
    function createLandBox(
        uint256 zone,
        uint256 price,
        uint256[] memory landId,
        bool isOpen
    ) public onlyOwner {
        require(!mysteryLand[zone].isCreate, "MysteryBox not recreate!!");
        mysteryLand[zone] = LandBox({
            price: price,
            landId: landId,
            isOpen: isOpen,
            isCreate: true
        });
    }

    function updateLandIdInBox(uint256 zone, uint256[] memory landId)
        public
        onlyOwner
    {
        require(mysteryLand[zone].isCreate, "MysteryBox not create!!");
        require(!mysteryLand[zone].isOpen, "MysteryBox is open!!");
        mysteryLand[zone].landId = landId;
    }

    function updatePriceLandInBox(uint256 zone, uint256 price)
        public
        onlyOwner
    {
        require(mysteryLand[zone].isCreate, "MysteryBox not create!!");
        require(!mysteryLand[zone].isOpen, "MysteryBox is open!!");
        mysteryLand[zone].price = price;
    }

    function updateIsOpenLandBox(uint256 zone, bool isOpen) public onlyOwner {
        require(mysteryLand[zone].isCreate, "zone is wrong!!");
        mysteryLand[zone].isOpen = isOpen;
    }

    function getMysteryLand(uint256 land) public view returns (LandBox memory) {
        return mysteryLand[land];
    }

    // land function for user
    function gachaLand(uint256 zone, bytes32 openType) public nonReentrant {
        // check myterybox
        require(mysteryLand[zone].isOpen, "MysteryBox not open!!");
        require(mysteryLand[zone].landId.length > 0, "MysteryBox is empty");
        require(mysteryLand[zone].price > 0, "MysteryBox price wrong");

        // choose type [check token and transfer, check whitelist and update whitelist]
        checkOnOpenMysteryBox(openType, mysteryLand[zone].price, "LAND", "0");

        // random land
        uint256 indexLandId = uint256(
            keccak256(
                abi.encodePacked(
                    "BitmonsterNFT",
                    block.difficulty,
                    block.timestamp,
                    block.number,
                    block.difficulty,
                    msg.sender
                )
            )
        ) % mysteryLand[zone].landId.length;
        uint256 resultLandId = mysteryLand[zone].landId[indexLandId];

        // indexLandId != last index
        if (indexLandId != mysteryLand[zone].landId.length - 1) {
            mysteryLand[zone].landId[indexLandId] = mysteryLand[zone].landId[
                mysteryLand[zone].landId.length - 1
            ];
        }
        // remove landId in box
        mysteryLand[zone].landId.pop();

        // mint NFT
        uint256 tokenId = ILand(addressLand).safeMint(
            msg.sender,
            zone,
            resultLandId
        );

        emit eOpenGachaLand(
            zone,
            mysteryLand[zone].price,
            resultLandId,
            tokenId
        );
    }

    // item function for owner
    function createItemBox(
        uint256 box,
        uint256 price,
        uint256[] memory keyItemId
    ) public onlyOwner {
        require(!mysteryItem[box].isCreate, "MysteryBox not recreate!!");
        mysteryItem[box] = ItemBox({
            price: price,
            keyItemId: keyItemId,
            isOpen: false,
            isCreate: true
        });
    }

    function updateItemIdInBox(
        uint256 _box,
        uint256 _keyItemId,
        uint256[] memory _itemId
    ) public onlyOwner {
        require(mysteryItem[_box].isCreate, "MysteryBox not create!!");
        require(!mysteryItem[_box].isOpen, "MysteryBox is open!!");
        itemId[_box][_keyItemId] = _itemId;
    }

    function updatePriceItemInBox(uint256 box, uint256 price) public onlyOwner {
        require(mysteryItem[box].isCreate, "MysteryBox not create!!");
        require(!mysteryItem[box].isOpen, "MysteryBox is open!!");
        mysteryItem[box].price = price;
    }

    function updateIsOpenItemBox(uint256 box, bool isOpen) public onlyOwner {
        require(mysteryItem[box].isCreate, "box is wrong!!");
        mysteryItem[box].isOpen = isOpen;
    }

    function getMysteryItem(uint256 box) public view returns (ItemBox memory) {
        return mysteryItem[box];
    }

    function getMysteryItemDetail(uint256 box, uint256 key)
        public
        view
        returns (uint256[] memory)
    {
        return itemId[box][key];
    }

    // item function for user
    function gachaItem(uint256 box, bytes32 openType) public {
        // check myterybox
        require(mysteryItem[box].isOpen, "MysteryBox not open!!");
        require(mysteryItem[box].keyItemId.length > 0, "MysteryBox is empty");
        require(mysteryItem[box].price > 0, "MysteryBox price wrong");

        // choose type [check token and transfer, check whitelist and update whitelist]
        checkOnOpenMysteryBox(
            openType,
            mysteryItem[box].price,
            "ITEM",
            StringsUpgradeable.toString(box)
        );

        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    "BitmonsterNFT",
                    block.difficulty,
                    block.timestamp,
                    block.number,
                    block.difficulty,
                    msg.sender
                )
            )
        );

        // random key item
        uint256 indexKey = random %
            mysteryItem[box].keyItemId[mysteryItem[box].keyItemId.length - 1];
        uint256 indexKeyResult;
        for (uint256 i = 0; i < mysteryItem[box].keyItemId.length; i++) {
            if (indexKey < mysteryItem[box].keyItemId[i]) {
                indexKeyResult = mysteryItem[box].keyItemId[i];
                break;
            }
        }

        // random item
        uint256 indexItemId = random % itemId[box][indexKeyResult].length;

        // increte open
        openItemBox = openItemBox + 1;
        // mint NFT
        IItem(addressItem).mint(
            msg.sender,
            itemId[box][indexKeyResult][indexItemId],
            1
        );

        emit eOpenGachaItem(
            box,
            mysteryItem[box].price,
            itemId[box][indexKeyResult][indexItemId]
        );
    }
}