import Config from "../../configs/config";
import { gqlAssetReturning } from "../../models/Asset";
import { gqlQuery } from "/models/GraphQL";

export default async function handler(req, res) {
  const query = req.query;

  let results = {};

  if (query) {
    let where;
    if (typeof query.id !== "undefined") {
      where = `{id: {_eq: ${query.id}}}`;
    }

    if (typeof query.tokenId !== "undefined") {
      where = `{
        tokenId: {_eq: ${query.tokenId}},
        nftAddress: {_eq: "${Config.ASSET_CA}"}
      }`;
    }

    let queryString = `
      assets ${where.length > 0 ? `(where: ${where})` : null}
      ${gqlAssetReturning}
    `;

    console.log("Query string : ", queryString);
    const { data } = await gqlQuery(queryString);
    // console.log(data);
    if (data.length > 0) {
      results = data[0].metadata;
    }
  }

  res.status(200).json(results);
}
