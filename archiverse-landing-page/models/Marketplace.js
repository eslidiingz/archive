import { BigNumber, ethers, providers } from "ethers";
import { formatUnits, id } from "ethers/lib/utils";
import { getLogsEvent } from "../utils/logs/getLogs";
import { objectForParams, objectForParamsNotKey } from "../utils/misc";
import { getWalletAddress } from "../utils/providers/connector";
import { gqlAssetReturning, updateAsset } from "./Asset";
import { getCollection, gqlCollectionReturning } from "./Collection";
import { getMetadataPolicy } from "./Covest";
import { gqlMutation, gqlQuery } from "./GraphQL";
import { getVouchers } from "./Voucher";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContact,
  web3Provider,
} from "/utils/providers/connector";

export const smartContractMarketplace = (_withJsonRPC = false) => {
  return smartContact(
    Config.MARKETPLACE_CA,
    Config.MARKETPLACE_ABI,
    _withJsonRPC
  );
};
const gqlBidReturning = () => {
  return ` {
    id
    bidder
    bidPrice
    bidTime
    bidId
    isAccept
    isActive
    isRefund
    updatedAt
    createdAt
    orderId
    user {
      profileImage
    }
    orders ${gqlMarketReturning()}
  }`;
};

export const gqlMarketReturning = (gqlAssetReturning = null) => {
  return `{
    id
    acceptTime
    buyerWallet
    currentPrice
    expiration
    isActive
    nftContract
    note
    orderType
    price
    sellerWallet
    terminatePrice
    tokenAddress
    tokenId
    createdAt
    updatedAt
    symbol
    ${gqlAssetReturning ? `assets ${gqlAssetReturning}` : ""}
    orderId
    }`;
};

export const getMarketplaces = async (_where) => {
  let query = `
    market_orders ${_where ? `(where: ${_where})` : ""}
    ${gqlMarketReturning(gqlAssetReturning)}
  `;
  return gqlQuery(query);
};

export const getlistingMarketplace = async () => {
  let res = await getMarketplaces(`{isActive: {_eq: true}}`);
  return res.data;
};
export const createOrderMarket = async (_data) => {
  console.log(objectForParams(_data));
  /**
   * Example code
   * 
  let obj = {
      orderType: 1,
      nftContract: "0xCcE78C275B4B3676A9166fBC7bEda9F8C601667B",
      tokenId: "0",
      tokenAddress: "0x8195fB43c73E577d66f07C55f863C8607b0976A6",
      price: 1,
      sellerWallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      marketDetails: {},
    };

    let res = await createOrderMarket(obj);
    
   * 
   */

  try {
    let mutation = `
      insert_market_orders_one(object: ${objectForParams(_data)})
      ${gqlMarketReturning(gqlAssetReturning)}
    `;

    console.log(mutation);

    let resCreated = await gqlMutation(mutation);
    console.log(resCreated);

    if (resCreated) {
      let _set = `orderId: ${resCreated.data.id}`;
      let _where = `{tokenId: {_eq: ${parseInt(resCreated.data.tokenId)}}}`;

      await updateAsset(_set, _where);

      return resCreated.data;
    }
  } catch (error) {
    console.log(
      `%c========== ERROR createOrderMarket()==========`,
      "color: red",
      error
    );
  }
};

export const updateOrderMarket = async (_set, _where) => {
  try {
    let mutation = `
		update_market_orders(_set: {${_set}}, where: ${_where}) {
			returning ${gqlMarketReturning(gqlAssetReturning)}
		}
    `;
    console.log(mutation);

    return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR createOrderMarket()==========`,
      "color: red",
      error
    );
  }
};

export const updateBidding = async (_set, _where) => {
  try {
    let mutation = `
    update_bids (_set: {${_set}}, where: ${_where}) {
      returning ${gqlBidReturning()}
    }`;
    return await gqlMutation(mutation);
  } catch (e) {
    console.error(e);
  }
};

export const getTopicCreateOrderEvents = async () => {
  const sm = smartContractMarketplace();
  // topic: 0x27c2ad68b19ef3dc37f06a9e465bc9a114d97e40429a6195356da85b63113642
  const topic = id(
    "CreateOrderEvent(address,uint256,uint256,uint256,uint256,address,uint256,address,uint8,bool)"
  );

  const events = await getLogsEvent(
    sm,
    Config.MARKETPLACE_CA,
    Config.MARKETPLACE_BLOCK_START,
    topic
  );

  const args = events.map((i) => i.args);

  return await Promise.all(
    args.map(async (i) => {
      return {
        expiration: formatUnits(i.expiration, "wei"),
        isOrderActive: i.isOrderActive,
        marketType: i.marketType,
        nftContract: i.nftContract,
        orderId: formatUnits(i.orderId, "wei"),
        price: formatUnits(i.price),
        refundPrice: formatUnits(i.refundPrice),
        seller: i.seller,
        tokenAddress: i.tokenAddress,
        tokenId: formatUnits(i.tokenId, "wei"),
      };
    })
  );
};

export const getTopicBoughtEvents = async () => {
  const sm = smartContractMarketplace();
  const topic = id(
    "BoughtEvent(address,address,uint256,uint8,uint256,uint256,uint256,bool)"
  );

  // console.log("topic", topic);

  const events = await getLogsEvent(
    sm,
    Config.MARKETPLACE_CA,
    Config.MARKETPLACE_BLOCK_START,
    topic
  );

  // console.log("events", events);

  const args = events.map((i) => i.args);
  return await Promise.all(
    args.map(async (i) => {
      return {
        buyer: i.buyer,
        fee: formatUnits(i.fee),
        isOrderActive: i.isOrderActive,
        marketType: i.marketType,
        nftContract: i.nftContract,
        orderId: formatUnits(i.orderId, "wei"),
        price: formatUnits(i.price),
        tokenId: formatUnits(i.tokenId, "wei"),
      };
    })
  );
};

export const setUtilityMetadata = async (utilities) => {
  console.log(utilities);
  const result = utilities.map(async (_u) => {
    if (_u.value.from === "covest") {
      const policies = await getMetadataPolicy(_u.value.poolId);
      return { type: "utilities", data: policies };
    } else if (_u.value.from === "voucher") {
      const condition = `{
        active: {
          _eq: true
        },
        no: {_eq: "${_u.value.poolId}"}
      }`;
      const voucher = await getVouchers(condition);
      return { type: "vouchers", data: voucher.data[0] };
    }
  });

  const response = await Promise.all(result);

  return response;
};

export const createBidding = async (_data) => {
  try {
    let mutation = `
      insert_bids_one(object: ${objectForParams(_data)})
      ${gqlBidReturning()}
    `;

    console.log("%cMutation bids : ", "color: green", mutation);

    let resCreated = await gqlMutation(mutation);
    console.log(resCreated);
  } catch (error) {
    console.log(
      `%c========== ERROR createOrderMarket()==========`,
      "color: red",
      error
    );
  }
};

export const getBiddingHistory = async (orderId) => {
  let query = `
    bids (where: {isActive: {_eq: true}, orderId: {_eq: ${orderId}}}) ${gqlBidReturning()}
  `;
  let result = await gqlQuery(query);
  return result.data;
};

export const getBidding = async (_where) => {
  let query = `
    bids (where: ${_where}) ${gqlBidReturning()}
  `;
  // console.log(query);
  let result = await gqlQuery(query);
  return result.data;
};
