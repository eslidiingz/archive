import { BigNumber, ethers, providers } from "ethers";
import { formatUnits, id } from "ethers/lib/utils";
import { objectForParams, objectForParamsNotKey } from "../utils/misc";
import { getCollection, gqlCollectionReturning } from "./Collection";
import { gqlMutation, gqlQuery } from "./GraphQL";
import {
  getTopicBoughtEvents,
  getTopicCreateOrderEvents,
  smartContractMarketplace,
} from "./Marketplace";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  getWalletAddress,
  smartContact,
  web3Provider,
} from "/utils/providers/connector";

// export const smartContractPlacement = (_withJsonRPC = false) => {
//   return smartContractMarketplace(_withJsonRPC);
// };

import { getLogsEvent } from "/utils/logs/getLogs";
import { getTokenSymbol } from "./Token";
import { getMetadata } from "./Asset";

export const getPlacements = async (_marketType = 0, _isActive = true) => {
  /** check DApp is already */
  if (await dAppChecked()) {
    const sm = smartContractMarketplace();
    const createdOrderResults = await getTopicCreateOrderEvents();
    const wallet = await getWalletAddress();

    // console.log("createdOrderResults", createdOrderResults);

    // const args = createdOrderResults.map((i) => i.args);
    const ownerList = createdOrderResults.filter((i) => {
      if (
        i.seller === wallet &&
        i.marketType === _marketType &&
        i.isOrderActive === _isActive
      ) {
        return i;
      }
    });

    let myPlacements = await Promise.all(ownerList);
    // console.log("myPlacements", myPlacements);

    const boughtEventTopicResults = await getTopicBoughtEvents();
    // console.log("boughtEventTopicResults", boughtEventTopicResults);

    let listings = myPlacements.filter((f) => {
      let _bought = boughtEventTopicResults.filter((b) => {
        return f.orderId == b.orderId && f.tokenId == b.tokenId;
      });

      return _bought.length == 0;
    });

    // console.log("listings", listings);

    let newObjectResults = await Promise.all(
      listings.map(async (i) => {
        i.symbol = await getTokenSymbol(i.tokenAddress);
        i.metadata = (
          await getMetadata(
            `{
              nft_address: {_eq: "${Config.ASSET_CA}"},
              token_id: {_eq: ${i.tokenId}}
            }`
          )
        )?.data[0]?.metadata;

        return i;
      })
    );

    return newObjectResults;
  } /** End check DApp */
};
