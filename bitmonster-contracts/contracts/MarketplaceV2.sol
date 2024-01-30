//SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external;

    function balanceOf(address account) external returns (uint256);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);

    function lock(
        address wallet,
        uint256 tokenId,
        uint256 amount
    ) external;

    function unlock(
        address wallet,
        uint256 tokenId,
        uint256 amount
    ) external;
}

interface IERC721 {
    function balanceOf(address owner) external returns (uint256);

    function ownerOf(uint256 tokenId) external returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);

    function lock(uint256 tokenId, bool status) external;
}

interface ITOKEN {
    function getTokenWhiteList(address token) external returns (bool);

    function getRateFee(uint256 price) external returns (uint256);
}

contract BitmonsterMarketplaceV2 is
    AccessControlUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _marketIdCounter;

    address public adminWallet;

    ITOKEN public wlToken;

    enum TokenType {
        CLOSED,
        ERC1155,
        ERC721
    }

    bytes4 public constant ERC1155_INTERFACE = 0xd9b67a26;
    bytes4 public constant ERC721_INTERFACE = 0x80ac58cd;

    struct Item {
        address itemAddress;
        TokenType itemType;
        address ownerAddress;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        uint256 expiration;
        address buyerAddress;
        bool available;
        uint256 marketId;
        address erc20Address;
    }

    Item[] public items;

    event PlaceItem(
        address item,
        uint256 price,
        uint256 indexed marketId,
        uint256 indexed tokenId,
        uint256 indexed amount
    );

    event BuyItem(
        uint256 indexed marketId,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price,
        address seller,
        address indexed buyer
    );

    event CancelItem(uint256 marketId, address owner, uint256 price);

    function initialize(address tokenWhiteList) public initializer {
        __AccessControl_init();
        __Ownable_init();
        __Pausable_init();

        wlToken = ITOKEN(tokenWhiteList);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        adminWallet = msg.sender;
    }

    modifier onlyExistItem(uint256 marketId) {
        (bool found, Item memory item) = getMarketItem(marketId);
        require(found, "Item is not exist");
        require(item.available, "Item is not available");
        require(item.expiration >= block.timestamp, "This item has expired");
        _;
    }

    modifier uniqueItem(
        address item,
        uint256 tokenId,
        uint256 amount
    ) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i].amount == amount &&
                items[i].itemAddress == item &&
                items[i].tokenId == tokenId &&
                items[i].available &&
                items[i].ownerAddress == msg.sender
            ) revert("This item is already created");
        }
        _;
    }

    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory item) = getMarketItem(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(item.itemAddress).supportsInterface(
            ERC721_INTERFACE
        );
        bool isERC1155 = IERC1155(item.itemAddress).supportsInterface(
            ERC1155_INTERFACE
        );
        require(
            (isERC721 &&
                IERC721(item.itemAddress).ownerOf(item.tokenId) ==
                msg.sender) ||
                (isERC1155 &&
                    IERC1155(item.itemAddress).balanceOf(
                        item.ownerAddress,
                        item.tokenId
                    ) >=
                    item.amount),
            "You are not owned this token."
        );
        _;
    }

    function getMarketItem(uint256 marketId)
        public
        view
        returns (bool, Item memory)
    {
        Item memory item = items[marketId];
        if (item.itemAddress == address(0)) return (false, item);
        return (true, item);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function placeItem(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address token
    ) public whenNotPaused uniqueItem(item, tokenId, amount) {
        TokenType itemType = TokenType.CLOSED;
        require(amount >= 1, "Amount is incorrect");
        require(price > 0, "Price must more than zero");
        require(wlToken.getTokenWhiteList(token), "Token isn't allow");
        require(
            IERC20(token).balanceOf(msg.sender) >= wlToken.getRateFee(price),
            "Balance is not enough"
        );
        IERC20(token).transferFrom(
            msg.sender,
            adminWallet,
            wlToken.getRateFee(price)
        );
        if (IERC1155(item).supportsInterface(ERC1155_INTERFACE)) {
            itemType = TokenType.ERC1155;
            require(
                IERC1155(item).balanceOf(msg.sender, tokenId) >= amount,
                "Item isn't owned"
            );
            require(
                IERC1155(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
        } else if (IERC721(item).supportsInterface(ERC721_INTERFACE)) {
            itemType = TokenType.ERC721;
            require(
                IERC721(item).ownerOf(tokenId) == msg.sender,
                "Item isn't owned"
            );
            require(
                IERC721(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
        } else revert("Type is incorrect");
        require(expiration > block.timestamp, "Incorrect expiration");
        uint256 marketId = _marketIdCounter.current();

        if (IERC1155(item).supportsInterface(ERC1155_INTERFACE)) {
            IERC1155(item).lock(msg.sender, tokenId, amount);
        } else if (IERC721(item).supportsInterface(ERC721_INTERFACE)) {
            IERC721(item).lock(tokenId, true);
        } else revert("Type is incorrect");

        _marketIdCounter.increment();
        items.push(
            Item(
                item,
                itemType,
                msg.sender,
                tokenId,
                amount,
                price,
                expiration,
                address(0),
                true,
                marketId,
                token
            )
        );
        emit PlaceItem(item, price, marketId, tokenId, amount);
    }

    function buyItem(uint256 marketId, uint256 amount)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory item) = getMarketItem(marketId);
        require(
            IERC20(item.erc20Address).balanceOf(msg.sender) >=
                item.price * amount,
            "Balance isn't enough"
        );
        require(item.buyerAddress == address(0), "Item is already sold");
        require(amount <= item.amount, "Item is not enough");
        require(msg.sender != item.ownerAddress, "You already owned this item");
        if (item.itemType == TokenType.ERC1155)
            require(
                IERC1155(item.itemAddress).balanceOf(
                    item.ownerAddress,
                    item.tokenId
                ) >= item.amount,
                "Seller doesn't owned"
            );
        if (item.itemType == TokenType.ERC721)
            require(
                IERC721(item.itemAddress).ownerOf(item.tokenId) ==
                    item.ownerAddress,
                "Seller doesn't owned"
            );

        IERC20(item.erc20Address).transferFrom(
            msg.sender,
            item.ownerAddress,
            item.price * amount
        );

        if (item.itemType == TokenType.ERC1155) {
            IERC1155(item.itemAddress).unlock(
                item.ownerAddress,
                item.tokenId,
                item.amount
            );
        } else if (item.itemType == TokenType.ERC721) {
            IERC721(item.itemAddress).lock(item.tokenId, false);
        }

        tranferItem(item, amount, msg.sender);

        if (item.amount == amount) {
            items[marketId].available = false;
            items[marketId].buyerAddress = msg.sender;
        }

        items[marketId].amount -= amount;

        emit BuyItem(
            marketId,
            item.tokenId,
            amount,
            item.price * amount,
            item.ownerAddress,
            msg.sender
        );
    }

    function cancelItem(uint256 marketId)
        public
        whenNotPaused
        onlyItemOwner(marketId)
    {
        (, Item memory item) = getMarketItem(marketId);
        require(items[marketId].available, "Items is already not available");
        require(msg.sender == item.ownerAddress, "You can't cancel this item");
        require(
            IERC20(item.erc20Address).balanceOf(msg.sender) >=
                wlToken.getRateFee(item.price),
            "Balance is not enough to cancel"
        );
        IERC20(item.erc20Address).transferFrom(
            msg.sender,
            adminWallet,
            wlToken.getRateFee(item.price)
        );

        if (item.itemType == TokenType.ERC1155) {
            IERC1155(item.itemAddress).unlock(
                item.ownerAddress,
                item.tokenId,
                item.amount
            );
        } else if (item.itemType == TokenType.ERC721) {
            IERC721(item.itemAddress).lock(item.tokenId, false);
        }
        emit CancelItem(item.marketId, item.ownerAddress, item.price);
        items[marketId].available = false;
    }

    function getItemsList() public view returns (Item[] memory) {
        return items;
    }

    function setAdminWallet(address wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        adminWallet = wallet;
    }

    function getMarketId(
        address item,
        address owner,
        uint256 tokenId,
        uint256 amount,
        bool status
    ) public view returns (bool, uint256) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i].available == status &&
                items[i].ownerAddress == owner &&
                items[i].tokenId == tokenId &&
                items[i].amount == amount &&
                items[i].itemAddress == item
            ) {
                return (true, items[i].marketId);
            }
        }
        return (false, 0);
    }

    function setAvailable(uint256 marketId)
        public
        whenNotPaused
        onlyExistItem(marketId)
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        items[marketId].available = false;
        if (items[marketId].itemType == TokenType.ERC1155) {
            IERC1155(items[marketId].itemAddress).unlock(
                items[marketId].ownerAddress,
                items[marketId].tokenId,
                items[marketId].amount
            );
        } else if (items[marketId].itemType == TokenType.ERC721) {
            IERC721(items[marketId].itemAddress).lock(
                items[marketId].tokenId,
                false
            );
        }

        return true;
    }

    function tranferItem(
        Item memory itemData,
        uint256 amount,
        address buyer
    ) internal virtual whenNotPaused {
        if (itemData.itemType == TokenType.ERC1155) {
            IERC1155(itemData.itemAddress).safeTransferFrom(
                itemData.ownerAddress,
                buyer,
                itemData.tokenId,
                amount,
                ""
            );
        } else if (itemData.itemType == TokenType.ERC721) {
            IERC721(itemData.itemAddress).safeTransferFrom(
                itemData.ownerAddress,
                buyer,
                itemData.tokenId
            );
        } else revert("Item type is incorrect");
    }
}
