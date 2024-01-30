import { gqlQuery } from "./GraphQL";

export const gqlVoucherReturning = `{
    currency
    detail
    name
    type
    value
    createdAt
    active
    no
    updatedAt
    id
    premiumAmount
  }`;

export const getVouchers = async (condition = null) => {
  let where = `{active: {_eq: true}}`;

  if (typeof condition !== "undefined") {
    where = condition;
  }

  let query = `vouchers (where: ${where}) ${gqlVoucherReturning}`;

  return gqlQuery(query);
};
