import { gqlQuery, gqlMutation } from "./GraphQL";
import { objectForParams, objectForParamsNotKey } from "../utils/misc";
import { gqlAssetReturning } from "./Asset";
import { gqlMarketReturning } from "./Marketplace";

export const gqlTransactionReturning = `{
    assetId
    asset_ids
    collectionId
    createdAt
    id
    price
    txHash
    txType
    updatedAt
    from
    to
    assets ${gqlAssetReturning}
    market_order {
      tokenAddress
      symbol
    }
}`;

export const getTransactions = async (_where, _order = "desc") => {
  if (!_order) _order = "desc";
  let query = `
		transactions ${
      _where ? `(where: ${_where}, order_by: {createdAt: ${_order}})` : ""
    }
		${gqlTransactionReturning}
	`;
  // console.log(query);
  return gqlQuery(query);
};

export const aggTransactions = async (_where) => {
  let query = `
		transactions_aggregate(where: ${_where}) {
			aggregate {
				min {
					price
				}
			}
		}
	`;
  console.log(query);
  return gqlQuery(query);
};

export const createTransactions = async (_data) => {
  try {
    let mutation = `
			insert_transactions_one(object: ${objectForParams(_data)})
			${gqlTransactionReturning}
		`;
    console.log(mutation);
    let resCreated = await gqlMutation(mutation);
    if (resCreated) {
      return resCreated.data;
    }
  } catch (error) {
    console.log(
      `%c========== ERROR createTransactions()==========`,
      "color: red",
      error
    );
  }
};
