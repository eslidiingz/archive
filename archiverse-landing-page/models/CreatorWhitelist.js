import { gqlQuery } from "./GraphQL";

let gqlCreatorReturning = `{
    id
    creatorWallet
    isOfficial
    createdAt
    updatedAt
}`;
export const getCreatorWhitelists = async (_where) => {
  let query = `
        creator_whitelist ${_where ? `(where: ${_where})` : ""}
        ${gqlCreatorReturning}
    `;
  return await gqlQuery(query);
};
