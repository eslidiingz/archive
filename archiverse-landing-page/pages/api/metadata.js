import Config from "../../configs/config";
import { gqlAssetReturning } from "/models/Asset";
import { gqlQuery } from "/models/GraphQL";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

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

    const { data } = await gqlQuery(queryString);

    if (data.length > 0) {
      results = data[0].metadata;
    }
  }

  res.status(200).json(results);
}
