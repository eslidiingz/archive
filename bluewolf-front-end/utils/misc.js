import { dAppChecked, web3Provider } from "./providers/connector";

/** Function without provider */
export const shortWallet = (_wallet) => {
  return _wallet ? `${_wallet.substring(0, 6)}...${_wallet.slice(-4)}` : null;
};

export const numberComma = (number) => {
  try {
    number = number.toString().replace(/,/g, "");
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return number;
  }
};

export const numberFormat = (number) => {
  try {
    if (number == "") {
      number = 0;
    }
    number = parseFloat(number);
    return numberComma(number.toFixed(2));
  } catch {
    return number;
  }
};

export const unlimitAmount =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

/** Function is require provider */
export const checkTransaction = async (txnHash) => {
  /** Check dAdpp connected */
  if (await dAppChecked()) {
    // const provider = new providers.JsonRpcProvider(
    //   "https://data-seed-prebsc-2-s2.binance.org:8545/"
    // );
    const provider = web3Provider();
    const txn = await provider.getTransactionReceipt(txnHash);
    return txn;
  } /** End Check dApp */
};

export const objectForParams = (object) => {
  let params = {};

  Object.keys(object).forEach((key) => {
    if (object[key] != "") {
      params[key] = object[key];
    }
  });

  let json = JSON.stringify(params);

  json.replace(/\\"/g, "\uFFFF"); // U+ FFFF
  json = json.replace(/"([^"]+)":/g, "$1:").replace(/\uFFFF/g, '\\"');

  return json;
};

export const objectForParamsNotKey = (object) => {
  let json = JSON.stringify(object);
  json.replace(/\\"/g, "\uFFFF"); // U+ FFFF
  json = json.replace(/"([^"]+)":/g, "$1:").replace(/\uFFFF/g, '\\"');
  return json;
};

export const capitalize = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
