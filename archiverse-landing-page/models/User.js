import { objectForParams } from "../utils/misc";
import { gqlMutation, gqlQuery } from "./GraphQL";

export const gqlUserReturning = `{
  id
  bio
  createdAt
  isActive
  isBanned
  isVerified
  name
  profileImage
  updatedAt
  wallet
}`;

export const updateUsers = async (userId, _set) => {
  let query = `
  update_users(where: {id: {_eq: ${userId}}}, ${_set}) {
    affected_rows
    returning ${gqlUserReturning}
  }`;
  console.log("Command : ", query);
  return await gqlMutation(query);
};

export const insertUser = async (_object) => {
  let mutation = `
  insert_users_one(object: ${_object})
  ${gqlUserReturning}`;
  console.log(mutation);
  return await gqlMutation(mutation);
};

export const getUsers = async (_where) => {
  let query = `
    users ${_where ? `(where: ${_where})` : ""}
    ${gqlUserReturning}
  `;

  console.log(query);

  return await gqlQuery(query);
};

export const createUser = async (_wallet) => {
  let mutation = `
    insert_users_one(object: {wallet: "${_wallet}"}) ${gqlUserReturning}
  `;

  return await gqlMutation(mutation);
};

export const isUserCreated = async (_wallet) => {
  let query = `
    users (where: {wallet: {_eq: "${_wallet}"}}) ${gqlUserReturning}
  `;
  let res = await gqlQuery(query);
  return res.length >= 1;
};
