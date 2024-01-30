import Config from "../configs/config";

export const getPoliciesList = async () => {
  const jsonBody = {
    chainId: Config.CHAIN_ID,
  };
  const response = await fetch(`${Config.COVEST_API_URI}/factory`, {
    method: "post",
    body: JSON.stringify(jsonBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if(!Array.isArray(json)) return [];
  const result = json.map((_i) => {
    return {
      poolId: _i.poolId,
      poolName: _i.poolName,
      policyId: _i.policyId || null,
      premiumAmount: _i.premiumAmount || 0,
      currency: "USDT",
      from: "covest",
    };
  });
  const arrConcat = [].concat.apply([], result);

  return arrConcat;
};

export const getMetadataPolicy = async (poolId) => {
  const response = await fetch(
    `${Config.COVEST_API_URI}/request/metadataPool?poolId=${poolId}&chainId=${Config.CHAIN_ID}`
  );

  const json = await response.json();
  return json;
};
