// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amoun
    ) external;

    function balanceOf(address account) external returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        returns (uint256);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory dat
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);
}

interface IERC721 {
    function balanceOf(address owner) external returns (uint256);

    function ownerOf(uint256 tokenId) external returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenI
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);
}

interface ITOKEN {
    function getFee(uint256 price) external view returns (uint256);
}

interface IITEM721 {
    function lock(uint256 _tokenId, bool status) external;
}

interface IITEM1155 {
    function lock(
        address account,
        uint256 _tokenId,
        uint256 amount
    ) external;

    function unlock(
        address account,
        uint256 _tokenId,
        uint256 amount
    ) external;
}

contract MarketplaceV1 is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter public _marketId;
    struct Item {
        address _item;
        address _owner;
        address _buyer;
        address _token;
        uint256 _tokenId;
        uint256 _amount;
        uint256 _price;
        uint256 _marketId;
        uint256 _placementTime;
        bool _available;
        TokenType _itemType;
    }
    struct Offer {
        address _buyer;
        uint256 _price;
        uint256 _amount;
        uint256 _marketId;
        uint256 _offerId;
        bool _isAccept;
        bool _active;
    }
    enum TokenType {
        CLOSED,
        ERC1155,
        ERC721
    }
    Item[] public items;
    ITOKEN public wlToken;
    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");
    bytes4 public constant ERC721_INTERFACE = 0x80ac58cd;
    bytes4 public constant ERC1155_INTERFACE = 0xd9b67a26;
    address payable public _adminWallet;
    mapping(address => Offer[]) public offers;

    constructor(address whitelist) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SETTER_ROLE, msg.sender);
        wlToken = ITOKEN(whitelist);
        _adminWallet = payable(msg.sender);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    modifier uniqueItem(
        address item,
        uint256 tokenId,
        uint256 amount
    ) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._amount == amount &&
                items[i]._item == item &&
                items[i]._tokenId == tokenId &&
                items[i]._available &&
                items[i]._owner == msg.sender
            ) revert("This item is already created");
        }
        _;
    }
    modifier onlyExistItem(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._buyer == address(0), "Already sold");
        require(found, "Item is not exist");
        require(itemData._available, "Item is not available");
        _;
    }
    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        if (itemData._itemType == TokenType.ERC1155) {
            require(
                IERC1155(itemData._item).balanceOf(
                    itemData._owner,
                    itemData._tokenId
                ) >= itemData._amount,
                "Item isn't owned"
            );
            require(
                IERC1155(itemData._item).isApprovedForAll(
                    itemData._owner,
                    address(this)
                ),
                "Item isn't approved"
            );
        } else if (itemData._itemType == TokenType.ERC721) {
            require(
                IERC721(itemData._item).ownerOf(itemData._tokenId) ==
                    itemData._owner,
                "Item isn't owned"
            );
            require(
                IERC721(itemData._item).isApprovedForAll(
                    itemData._owner,
                    address(this)
                ),
                "Item isn't approved"
            );
        } else {
            revert("Caller isn't owned");
        }
        _;
    }

    function checkItemOwner(
        TokenType itemType,
        address item,
        uint256 amount,
        uint256 tokenId
    ) public {
        if (itemType == TokenType.ERC721) {
            require(
                IERC721(item).ownerOf(tokenId) == msg.sender,
                "Item isn't owned"
            );
            require(
                IERC721(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
            require(amount == 1, "Amount is incorrect");
        } else if (itemType == TokenType.ERC1155) {
            require(
                IERC1155(item).balanceOf(msg.sender, tokenId) >= amount,
                "Item isn't owned"
            );
            require(
                IERC1155(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
        } else {
            revert("TokenType is incorrect");
        }
    }

    function _getItemInfo(uint256 marketId)
        public
        view
        returns (bool, Item memory)
    {
        Item memory itemData = items[marketId];
        if (itemData._item == address(0)) return (false, itemData);
        return (true, itemData);
    }

    function placeItem(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address token
    ) public whenNotPaused uniqueItem(item, tokenId, amount) {
        TokenType itemType = TokenType.CLOSED;
        uint256 placementFee = wlToken.getFee(price);
        require(amount >= 1 && price > 0, "Amount & price is incorrect");
        require(IERC20(token).balanceOf(msg.sender) >= placementFee);
        if (IERC721(item).supportsInterface(ERC721_INTERFACE)) {
            itemType = TokenType.ERC721;
        } else if (IERC1155(item).supportsInterface(ERC1155_INTERFACE)) {
            itemType = TokenType.ERC1155;
        }
        checkItemOwner(itemType, item, amount, tokenId);
        IERC20(token).transferFrom(
            msg.sender,
            _adminWallet,
            wlToken.getFee(price)
        );
        IITEM721(item).lock(tokenId, true);
        uint256 marketId = _marketId.current();
        _marketId.increment();
        items.push(
            Item(
                item,
                msg.sender,
                address(0),
                token,
                tokenId,
                amount,
                price,
                marketId,
                block.timestamp,
                true,
                itemType
            )
        );
    }

    function cancelItem(uint256 marketId)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        checkItemOwner(
            itemData._itemType,
            itemData._item,
            itemData._amount,
            itemData._tokenId
        );
        require(msg.sender == itemData._owner, "Caller isn't owned");
        items[marketId]._available = false;
        IITEM721(itemData._item).lock(itemData._tokenId, false);
    }

    function getItems() public view returns (Item[] memory) {
        return items;
    }

    function getMarketId(
        address item,
        address owner,
        uint256 tokenId,
        uint256 amount,
        bool isAvailable
    ) public view returns (bool, uint256) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._available == isAvailable &&
                items[i]._owner == owner &&
                items[i]._tokenId == tokenId &&
                items[i]._amount == amount &&
                items[i]._item == item
            ) {
                return (true, items[i]._marketId);
            }
        }
        return (false, 0);
    }

    function setAdminWallet(address admin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(admin != address(0), "Address invaild");
        _adminWallet = payable(admin);
    }

    function buyItem(uint256 marketId, uint256 amount)
        public
        whenNotPaused
        onlyExistItem(marketId)
        onlyItemOwner(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._buyer == address(0), "Already sold");
        require(amount >= 1 && amount <= itemData._amount, "Amount invalid");
        require(msg.sender != itemData._owner, "Already owned");
        if (amount == itemData._amount) {
            items[marketId]._available = false;
            items[marketId]._buyer = msg.sender;
        }
        items[marketId]._amount -= amount;
        IERC20(itemData._token).transferFrom(
            msg.sender,
            itemData._owner,
            itemData._price
        );
        IITEM721(itemData._item).lock(itemData._tokenId, false);
        tranferItem(itemData, amount, msg.sender);
    }

    function makeOffer(
        uint256 marketId,
        uint256 price,
        uint256 amount
    ) public whenNotPaused onlyExistItem(marketId) onlyItemOwner(marketId) {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >= price,
            "Balance isn't enough"
        );
        require(
            amount >= 1 && itemData._amount >= amount,
            "Amount isn't enough"
        );
        require(itemData._buyer == address(0), "Item is already sold");
        require(itemData._owner != msg.sender, "Already owned");
        offers[itemData._owner].push(
            Offer(
                msg.sender,
                price,
                amount,
                marketId,
                offers[itemData._owner].length,
                false,
                true
            )
        );
    }

    function cancelOffer(uint256 offerId, uint256 marketId)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(
            offers[itemData._owner][offerId]._buyer == msg.sender,
            "Don't have permission"
        );
        uint256 fee = wlToken.getFee(offers[itemData._owner][offerId]._price);
        offers[itemData._owner][offerId]._active = false;
        IERC20(itemData._token).transferFrom(msg.sender, _adminWallet, fee);
    }

    function getOfferLists(address owner) public view returns (Offer[] memory) {
        return offers[owner];
    }

    function acceptOffer(uint256 marketId, uint256 offerId)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._buyer == address(0), "Already sold");
        Offer memory offerData = offers[msg.sender][offerId];
        require(
            offerData._active && offerData._isAccept == false,
            "Offer isn't active"
        );
        require(itemData._amount >= offerData._amount, "Amount isn't enough");
        uint256 totalPrice = offerData._price * offerData._amount;
        if (offerData._amount == itemData._amount) {
            items[marketId]._available = false;
            items[marketId]._buyer = offerData._buyer;
        }
        items[marketId]._amount -= offerData._amount;
        offers[itemData._owner][offerId]._isAccept = true;
        offers[itemData._owner][offerId]._active = false;
        IERC20(itemData._token).transferFrom(
            offerData._buyer,
            itemData._owner,
            totalPrice
        );
        IITEM721(itemData._item).lock(itemData._tokenId, false);
        tranferItem(itemData, offerData._amount, offerData._buyer);
    }

    function tranferItem(
        Item memory itemData,
        uint256 amount,
        address buyer
    ) internal virtual whenNotPaused {
        if (itemData._itemType == TokenType.ERC1155) {
            IERC1155(itemData._item).safeTransferFrom(
                itemData._owner,
                buyer,
                itemData._tokenId,
                amount,
                ""
            );
        } else if (itemData._itemType == TokenType.ERC721) {
            IERC721(itemData._item).safeTransferFrom(
                itemData._owner,
                buyer,
                itemData._tokenId
            );
        } else {
            revert("Item is incorrect");
        }
    }
}
