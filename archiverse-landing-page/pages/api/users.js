import { gqlUserReturning } from "../../models/User";
import { gqlQuery } from "/models/GraphQL";

export default async function handler(req, res) {
  const query = req.query;

  let results = {};

  if (query) {
    let where;
    if (typeof query.wallet !== "undefined") {
      where = `{wallet: {_eq: "${query.wallet}"}}`;
    }

    let queryString = `
      users ${where.length > 0 ? `(where: ${where})` : null}
      ${gqlUserReturning}
    `;

    console.log(queryString);

    const { data } = await gqlQuery(queryString);
    // console.log(data);
    if (data.length > 0) {
      results = data[0];
    }
  }

  res.status(200).json(results);
}
