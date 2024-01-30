// SPDX-License-Identifier:  Multiverse Expert
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function ownerOf(uint256 tokenId) external returns (address);
}

interface IBEP20 {
    function totalSupply() external view returns (uint256);

    function decimals() external view returns (uint8);

    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function getOwner() external view returns (address);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address _owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function setIsFeeExempt(address holder, bool exempt) external;
}

contract BWMarket is ReentrancyGuard, ERC721Holder, Pausable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter public _orderIds;
    Counters.Counter public _offerIds;

    uint256 public feesRate;
    address public recipientWallet;
    address public bwc;
    address public pair;

    struct Order {
        address nftContract;
        uint256 orderId;
        uint256 tokenId;
        address seller;
        uint256 price;
        address buyWithTokenContract;
        bool isOpen;
        bool isSold;
        bool isOffered;
    }

    struct Offer {
        address buyer;
        uint256 price;
        uint256 tokenId;
        uint256 offerId;
        address nftContract;
        address buyWithTokenContract;
        uint256 timeOfferStart;
        uint256 timeOfferEnd;
        bool isAccept;
        bool isActive;
    }

    /************************** Mappings *********************/

    mapping(address => mapping(uint256 => Order[])) public orders; // NFTcontract => tokenid => Order[]
    mapping(address => mapping(uint256 => Offer[])) private offers; // NFTcontract => tokenid  => Offer[]
    mapping(uint256 => uint256) private offerIndex;
    /************************** Events *********************/

    event OrderCreatedEvent(
        address indexed nftContract,
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        address buyWithTokenContract,
        bool isOpen,
        bool isSold,
        bool isOffered
    );

    event OrderCanceledEvent(
        address indexed nftContract,
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address seller,
        address buyWithTokenContract,
        bool isOpen,
        bool isSold,
        bool isOffered
    );

    event BougthEvent(
        address indexed nftContract,
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price,
        uint256 fee,
        address buyWithTokenContract,
        bool isOpen,
        bool isSold
    );

    event CreateOfferEvent(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 indexed offerId,
        uint256 price,
        address nftContract,
        address buyWithTokenContract,
        uint256 timeOfferStart,
        uint256 timeOfferEnd,
        bool isAccept,
        bool isActive
    );

    event CancelOfferEvent(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 indexed offerId,
        bool isActive
    );

    event AcceptOfferEvent(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 indexed offerId,
        address nftContract,
        address seller,
        uint256 price,
        bool isSold,
        bool isAccept,
        bool isActive
    );

    constructor(address _wallet, uint256 _fee) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        recipientWallet = _wallet;
        feesRate = _fee;
        bwc = 0xFEFe065667319Ab71c54e00C12F46229f10446fF;
        pair = 0x9695052D6E8C6cc707F50D1A191Ac68EDECBc44e;
    }

    /******************* Write Functions *********************/

    function updateFeesRate(uint256 newRate)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(newRate >= 0 && newRate < 10000, "Invalid fee rate");
        feesRate = newRate;
    }

    function updateRecipientWallet(address newWallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(newWallet != address(0), "Wallet must not be address 0");
        require(newWallet != pair, "RecipientWallet != pair");
        recipientWallet = newWallet;
    }

    /*******************Read Functions *********************/

    function getOffer(address nftContract, uint256 tokenId)
        public
        view
        returns (Offer[] memory)
    {
        return offers[nftContract][tokenId];
    }

    function orderLength(address nftContract, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return orders[nftContract][tokenId].length;
    }

    /******************* Action Functions *********************/

    /* Places an item for sale on the marketplace */
    function createOrder(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        address buyWithTokenContract
    ) public whenNotPaused nonReentrant {
        require(price > 0, "Price must be more than 0");
        // Token recipient != pair
        require(msg.sender != pair, "Token recipient != pair");
        //Transfer NFT
        IERC721(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        //Update status
        uint256 orderId = _orderIds.current();
        orders[nftContract][tokenId].push(
            Order(
                nftContract,
                orderId,
                tokenId,
                msg.sender,
                price,
                buyWithTokenContract,
                true,
                false,
                false
            )
        );
        _orderIds.increment();

        emit OrderCreatedEvent(
            nftContract,
            orderId,
            tokenId,
            msg.sender,
            price,
            buyWithTokenContract,
            true,
            false,
            false
        );
    }

    function cancelOrder(address nftContract, uint256 tokenId)
        public
        whenNotPaused
        nonReentrant
    {
        Order memory orderData = orders[nftContract][tokenId][
            orders[nftContract][tokenId].length - 1
        ];
        require(orderData.seller == msg.sender, "You don't own the order");
        //Update status close order = false
        orders[nftContract][tokenId][orders[nftContract][tokenId].length - 1]
            .isOpen = false;
        //Transfer NFT
        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        emit OrderCanceledEvent(
            nftContract,
            orderData.orderId,
            tokenId,
            msg.sender,
            orderData.buyWithTokenContract,
            false,
            false,
            false
        );
    }

    function Buy(address nftContract, uint256 tokenId)
        public
        whenNotPaused
        nonReentrant
    {
        Order memory orderData = orders[nftContract][tokenId][
            orders[nftContract][tokenId].length - 1
        ];
        require(orderData.isOpen == true, "NFT isn't ordered");
        uint256 price = orderData.price;
        uint256 fee = (price * feesRate) / 10000;
        uint256 balance = (orderData.buyWithTokenContract == bwc)
            ? IBEP20(orderData.buyWithTokenContract).balanceOf(msg.sender)
            : IERC20(orderData.buyWithTokenContract).balanceOf(msg.sender);
        require(
            balance >= price,
            "Your balance has not enough amount + including fee."
        );
        if (orderData.buyWithTokenContract == bwc) {
            // Except fee for sender.
            IBEP20(orderData.buyWithTokenContract).setIsFeeExempt(
                msg.sender,
                true
            );
            //Transfer fee to recipientWallet.
            IBEP20(orderData.buyWithTokenContract).transferFrom(
                msg.sender,
                recipientWallet,
                fee
            );
            //Transfer token to nft seller.
            IBEP20(orderData.buyWithTokenContract).transferFrom(
                msg.sender,
                orderData.seller,
                price - fee
            );
            // Cancle except fee for sender.
            IBEP20(orderData.buyWithTokenContract).setIsFeeExempt(
                msg.sender,
                false
            );
        } else {
            //Transfer fee to recipientWallet.
            IERC20(orderData.buyWithTokenContract).transferFrom(
                msg.sender,
                recipientWallet,
                fee
            );
            //Transfer token to nft seller.
            IERC20(orderData.buyWithTokenContract).transferFrom(
                msg.sender,
                orderData.seller,
                price - fee
            );
        }

        //Transfer NFT
        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        //Update status
        orders[nftContract][tokenId][orders[nftContract][tokenId].length - 1]
            .isOpen = false;
        orders[nftContract][tokenId][orders[nftContract][tokenId].length - 1]
            .isSold = true;

        delete offers[nftContract][tokenId];

        emit BougthEvent(
            nftContract,
            orderData.orderId,
            tokenId,
            orderData.seller,
            msg.sender,
            price,
            fee,
            orderData.buyWithTokenContract,
            false,
            true
        );
    }

    /* Create an offer for specific order on the marketplace */
    function makeOffer(
        uint256 tokenId,
        uint256 price,
        address buyWithTokenContract,
        address nftContract,
        uint256 endTime
    ) public whenNotPaused nonReentrant {
        require(price > 0, "Price must be more than 0");
        uint256 balance = (buyWithTokenContract == bwc)
            ? IBEP20(buyWithTokenContract).balanceOf(msg.sender)
            : IERC20(buyWithTokenContract).balanceOf(msg.sender);
        require(
            balance >= price,
            "Your balance has not enough amount + including fee."
        );

        uint256 offerId = _offerIds.current();
        offerIndex[offerId] = offers[nftContract][tokenId].length;
        offers[nftContract][tokenId].push(
            Offer(
                msg.sender,
                price,
                tokenId,
                offerId,
                nftContract,
                buyWithTokenContract,
                block.timestamp,
                endTime,
                false,
                true
            )
        );
        _offerIds.increment();

        emit CreateOfferEvent(
            msg.sender,
            tokenId,
            offerId,
            price,
            nftContract,
            buyWithTokenContract,
            block.timestamp,
            endTime,
            false,
            true
        );
    }

    /* Cancel an offer for specific order on the marketplace */
    function cancelOffer(
        address nftContract,
        uint256 tokenId,
        uint256 offerId
    ) public whenNotPaused nonReentrant {
        uint256 index = offerIndex[offerId];

        require(
            offers[nftContract][tokenId][index].buyer == msg.sender,
            "You don't own the offer"
        );
        require(
            offers[nftContract][tokenId][index].isActive == true,
            "It's canceled item"
        );

        offers[nftContract][tokenId][index].isActive = false;

        emit CancelOfferEvent(msg.sender, tokenId, offerId, false);
    }

    function acceptOffer(
        uint256 tokenId,
        uint256 offerId,
        address buyWithTokenContract,
        address nftContract
    ) public whenNotPaused nonReentrant {
        uint256 index = offerIndex[offerId];
        Order memory orderData = orders[nftContract][tokenId][
            orders[nftContract][tokenId].length - 1
        ];
        require(
            offers[nftContract][tokenId][index].isAccept == false,
            "This offer is already accepted"
        );
        require(
            offers[nftContract][tokenId][index].isActive == true,
            "This offer is not isActive"
        );
        require(
            block.timestamp <= offers[nftContract][tokenId][index].timeOfferEnd,
            "This offer is end"
        );
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender ||
                (IERC721(nftContract).ownerOf(tokenId) == address(this) &&
                    orderData.seller == msg.sender),
            "You can't accept"
        );
        address buyerAddr = offers[nftContract][tokenId][index].buyer;
        uint256 price = offers[nftContract][tokenId][index].price;
        uint256 fee = (price * feesRate) / 10000;
        uint256 balance = (buyWithTokenContract == bwc)
            ? IBEP20(buyWithTokenContract).balanceOf(msg.sender)
            : IERC20(buyWithTokenContract).balanceOf(msg.sender);
        require(
            balance >= price,
            "Your balance has not enough amount + including fee."
        );
        if (buyWithTokenContract == bwc) {
            // Token recipient != pair
            require(msg.sender != pair, "Token recipient != pair");
            // Except fee for sender.
            IBEP20(buyWithTokenContract).setIsFeeExempt(buyerAddr, true);
            //Transfer fee to platform.
            IBEP20(buyWithTokenContract).transferFrom(
                buyerAddr,
                recipientWallet,
                fee
            );
            //Transfer token(WolfCoin) to nft seller.
            IBEP20(buyWithTokenContract).transferFrom(
                buyerAddr,
                msg.sender,
                price - fee
            );
            // Cancle except fee for sender.
            IBEP20(buyWithTokenContract).setIsFeeExempt(buyerAddr, false);
        } else {
            //Transfer fee to platform.
            IERC20(buyWithTokenContract).transferFrom(
                buyerAddr,
                recipientWallet,
                fee
            );
            //Transfer token(WolfCoin) to nft seller.
            IERC20(buyWithTokenContract).transferFrom(
                buyerAddr,
                msg.sender,
                price - fee
            );
        }

        //Update status
        if (IERC721(nftContract).ownerOf(tokenId) == address(this)) {
            orders[nftContract][tokenId][
                orders[nftContract][tokenId].length - 1
            ].isOpen = false;
        }

        uint256 orderId = _orderIds.current();
        orders[nftContract][tokenId].push(
            Order(
                nftContract,
                orderId,
                tokenId,
                msg.sender,
                price,
                buyWithTokenContract,
                false,
                false,
                true
            )
        );
        _orderIds.increment();
        //Transfer NFT
        IERC721(nftContract).safeTransferFrom(
            IERC721(nftContract).ownerOf(tokenId),
            buyerAddr,
            tokenId
        );

        delete offers[nftContract][tokenId];

        emit AcceptOfferEvent(
            buyerAddr,
            tokenId,
            offerId,
            nftContract,
            msg.sender,
            price,
            true,
            true,
            false
        );
    }
}
