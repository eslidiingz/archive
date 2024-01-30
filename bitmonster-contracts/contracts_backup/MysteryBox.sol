//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

contract MysteryBox is Ownable, ReentrancyGuard {
    // monster
    struct MonsterBox {
        uint256 price;
        uint256[] monsterId;
        bool isOpen;
        bool isCreate;
    }
    mapping(string => MonsterBox) private mysteryMonster; // type => data

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

    // global
    address public addressRecipient;
    address public addressToken;
    address public addressMonster;
    address public addressLand;
    address public addressItem;

    // Events
    event eOpenGachaMonster(
        string boxType,
        uint256 price,
        uint256 monsterId,
        uint256 tokenId
    );
    event eOpenGachaLand(
        uint256 zone,
        uint256 price,
        uint256 landId,
        uint256 tokenId
    );
    event eOpenGachaItem(uint256 boxType, uint256 price, uint256 itemId);

    constructor(
        address recipient,
        address tokenBUSD,
        address monster,
        address land,
        address item
    ) {
        addressRecipient = recipient;
        addressToken = tokenBUSD;
        addressMonster = monster;
        addressLand = land;
        addressItem = item;
    }

    // global function
    function tranferTokenToRecipient(uint256 amount) private {
        require(
            IBusd(addressToken).balanceOf(msg.sender) >= amount,
            string(abi.encodePacked("TOKEN <= ", Strings.toString(amount)))
        );
        IBusd(addressToken).transferFrom(msg.sender, addressRecipient, amount);
    }

    // monster function for owner
    function createMonsterBox(
        string memory box,
        uint256 price,
        uint256[] memory monsterId,
        bool isOpen
    ) public onlyOwner {
        require(!mysteryMonster[box].isCreate, "MysteryBox not recreate!!");
        mysteryMonster[box] = MonsterBox({
            price: price,
            monsterId: monsterId,
            isOpen: isOpen,
            isCreate: true
        });
    }

    function updateMonsterIdInBox(string memory box, uint256[] memory monsterId)
        public
        onlyOwner
    {
        require(mysteryMonster[box].isCreate, "MysteryBox not create!!");
        require(!mysteryMonster[box].isOpen, "MysteryBox is open!!");
        mysteryMonster[box].monsterId = monsterId;
    }

    function undateIsOpenMonsterBox(string memory box, bool isOpen)
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

    // monster function for user
    function gachaMonster(string memory box) public nonReentrant {
        // check myterybox
        require(mysteryMonster[box].isOpen, "MysteryBox not open!!");
        require(
            mysteryMonster[box].monsterId.length > 0,
            "MysteryBox is empty"
        );
        require(mysteryMonster[box].price > 0, "MysteryBox price wrong");

        // check token and transfer
        tranferTokenToRecipient(mysteryMonster[box].price);

        // random monster
        uint256 indexMonsterId = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % mysteryMonster[box].monsterId.length;
        uint256 resultMonsterId = mysteryMonster[box].monsterId[indexMonsterId];
        // mint NFT
        uint256 tokenId = IMonster(addressMonster).safeMint(
            msg.sender,
            resultMonsterId
        );

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

    function undateIsOpenLandBox(uint256 zone, bool isOpen) public onlyOwner {
        require(mysteryLand[zone].isCreate, "zone is wrong!!");
        mysteryLand[zone].isOpen = isOpen;
    }

    function getMysteryLand(uint256 land) public view returns (LandBox memory) {
        return mysteryLand[land];
    }

    // land function for user
    function gachaLand(uint256 zone) public nonReentrant {
        // check myterybox
        require(mysteryLand[zone].isOpen, "MysteryBox not open!!");
        require(mysteryLand[zone].landId.length > 0, "MysteryBox is empty");
        require(mysteryLand[zone].price > 0, "MysteryBox price wrong");

        // check token and transfer
        tranferTokenToRecipient(mysteryLand[zone].price);

        // random land
        uint256 indexLandId = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
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
    )
        public
        // uint => uint256[]
        // bool isOpen
        onlyOwner
    {
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

    function undateIsOpenItemBox(uint256 box, bool isOpen) public onlyOwner {
        require(mysteryItem[box].isCreate, "box is wrong!!");
        mysteryItem[box].isOpen = isOpen;
    }

    function getmysteryItem(uint256 box)
        public
        view
        onlyOwner
        returns (ItemBox memory)
    {
        return mysteryItem[box];
    }

    function getmysteryItemDetail(uint256 box, uint256 key)
        public
        view
        returns (uint256[] memory)
    {
        return itemId[box][key];
    }

    // item function for user
    function gachaItem(uint256 box) public nonReentrant {
        // check myterybox
        require(mysteryItem[box].isOpen, "MysteryBox not open!!");
        require(mysteryItem[box].keyItemId.length > 0, "MysteryBox is empty");
        require(mysteryItem[box].price > 0, "MysteryBox price wrong");

        // check token and transfer
        tranferTokenToRecipient(mysteryItem[box].price);

        // random key item
        uint256 indexKey = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % mysteryItem[box].keyItemId[mysteryItem[box].keyItemId.length - 1];
        uint256 indexKeyResult;
        for (uint256 i = 0; i < mysteryItem[box].keyItemId.length; i++) {
            if (indexKey < mysteryItem[box].keyItemId[i]) {
                indexKeyResult = mysteryItem[box].keyItemId[i];
                break;
            }
        }

        // random item
        uint256 indexItemId = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % itemId[box][indexKeyResult].length;
        uint256 resultItemId = itemId[box][indexKeyResult][indexItemId];

        // mint NFT
        IItem(addressItem).mint(msg.sender, resultItemId, 1);

        emit eOpenGachaItem(box, mysteryItem[box].price, resultItemId);
    }
}
