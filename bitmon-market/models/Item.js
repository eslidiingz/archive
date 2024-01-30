import { BigNumber, ethers } from "ethers";
import { unlimitAmount } from "/utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContract } from "/utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";
import { getMarketLists } from "./Market";
import { createBurn } from "../utils/api/user-api";

export const smartContractItem = (providerType = false) => {
  if (providerType === true) {
    return smartContract(Config.ITEM_CA, Config.ITEM_ABI, true);
  } else {
    return smartContract(Config.ITEM_CA, Config.ITEM_ABI, false);
  }
};

export const getItemMetadata = async (_itemId) => {
  if (debug)
    console.log(
      `%c>>>>> getMetadataItem (_itemId) [${_itemId}] >>>>>`,
      "color: yellow"
    );

  let itemMetadata = {};

  /** Check dApp before action anything */
  // if (await dAppChecked()) {
  /** [smItem] instant smart contract */
  // const smItem = smartContractItem();

  /** Retrived metadata uri function on block chain  */
  // const metadataURI = await smItem.tokenURI(_tokenId);

  let metadataURI = `${Config.METADATA_URI}/item/${_itemId}`;

  /** Call data uri for json meatadata of item */
  const res = await fetch(metadataURI);
  itemMetadata = await res.json();
  // } /** End Check dApp */

  if (debug)
    console.log(
      `%c<<<<< getMetadataItem (_itemId) [${_itemId}] <<<<<`,
      "color: yellow",
      itemMetadata
    );

  return itemMetadata;
};

export const getItemTotalSupply = async (_zone) => {
  if (debug)
    console.log(
      `%c>>>>> getItemTotalSupply(_zone) [${_zone}] >>>>>`,
      "color: yellow"
    );

  let itemMetadata = {};

  /** Check dApp before action anything */
  if (await dAppChecked()) {
  } /** End Check dApp */

  if (debug)
    console.log(
      `%c<<<<< getItemTotalSupply(_zone) [${_zone}] <<<<<`,
      "color: yellow",
      itemMetadata
    );

  return itemMetadata;
};

export const getAmountLock = async (wallet, tokenId) => {
  const scItem = smartContractItem(true);
  const amountLock = await scItem.countAmountLock(wallet, tokenId);
  console.log("amountLock", amountLock);
  return amountLock;
};
const getLock = async (wallet, tokenId) => {
  try {
    let result = null;
    while (result == null) {
      const res = await getAmountLock(wallet, tokenId);
      console.log("result value", i, res);
      if (parseInt(BigNumber.from(res)._hex, 16) >= 0) {
        result = parseInt(BigNumber.from(res)._hex, 16);
      }
    }
    return result;
  } catch (error) {
    console.error("getLock", error);
  }
};
const getTokensByOwnerOnChain = async (smItem, wallet) => {
  try {
    let lockedAmount = [];
    console.log("lockedAmount");
    const itemTokens = await smItem.getTokensByOwner(wallet);
    const wallets = new Array(itemTokens.length).fill(wallet);
    const assetBalanceList = await smItem.balanceOfBatch(
      wallets,
      itemTokens.map((tokenBignumber) =>
        parseInt(BigNumber.from(tokenBignumber)._hex, 16)
      )
    );
    for (let i = 0; i < itemTokens.length; i++) {
      const tokenId = parseInt(BigNumber.from(itemTokens[i])._hex, 16);
      const lock = await getLock(wallet, tokenId);
      lockedAmount.push(lock != undefined ? lock : 0);
    }
    return [itemTokens, assetBalanceList, lockedAmount];
  } catch (error) {
    console.log("error catch", error);
    // await getNftAssetItems(wallet);
  }
};
export const getNftAssetItems = async (wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> getNftAssetItems (_wallet) [${wallet}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] smart contract instance */
      const smItem = smartContractItem(false);

      const assets = [];
      // console.log(assets);

      const fetchData = await getTokensByOwnerOnChain(smItem, wallet);
      if (!fetchData) {
        return;
      }
      const itemTokens = fetchData[0];
      const assetBalanceList = fetchData[1];
      const lockedAmount = fetchData[2];
      console.log("itemTokens", itemTokens);
      console.log("assetBalanceList", assetBalanceList);
      console.log("lockedAmount", lockedAmount);

      await Promise.all(
        itemTokens?.map?.(async (token, index) => {
          const tokenId = parseInt(BigNumber.from(token)._hex, 16);
          // const lockedAmount = await getAmountLock(wallet, tokenId);

          let res = await fetch(`${Config.METADATA_URI}/item/${tokenId}`);
          res = await res.json();

          const balance =
            parseInt(BigNumber.from(assetBalanceList[index])._hex, 16) -
            lockedAmount[index];

          if (res && balance > 0) {
            res.tokenId = tokenId;
            res.balance = balance;

            assets.push({ ...res });
          }
        })
      );

      return assets;
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< getNftAssetItems (_wallet) [${wallet}] <<<<<`,
        "color: yellow",
        wallet
      );

    return [];
  } catch (err) {
    console.error(err.message, "CRASHHHH");
    return [];
  }
};

export const setApproveForAll = async () => {
  try {
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      const provider = web3Provider();
      const signer = provider.getSigner();
      const wallet = await signer.getAddress();

      /** Check wallet is connected */
      if (!wallet) {
        Swal.fire(
          "Warning",
          "Please, Connect wallet before make a transaction.",
          "warning"
        );
        return;
      }

      /** [smMonster] instant smart contract */
      const scItem = smartContractItem();

      const marketAddr = Config.MARKET_CA;

      const setApprove = await scItem.setApprovalForAll(marketAddr, true);
      const setApproveTx = await setApprove.wait();

      return setApproveTx ? true : false;
    } /** End Check dApp */

    return false;
  } catch {
    return false;
  }
};

export const getApproveForAll = async () => {
  try {
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      const provider = web3Provider();
      const signer = provider.getSigner();
      const wallet = await signer.getAddress();

      /** [smMonster] instant smart contract */
      const scItem = smartContractItem();

      const marketAddr = Config.MARKET_CA;
      console.log("MK CA", marketAddr);

      const isApproved = await scItem.isApprovedForAll(wallet, marketAddr);

      return isApproved ? true : false;
    } /** End Check dApp */

    return false;
  } catch {
    return false;
  }
};

export const redeemItem = async (tokenId, amount = 1, wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> redeemItem (_tokenId) [${tokenId}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] instant smart contract */
      const smItem = smartContractItem();

      const result = await smItem.redeemNFT(tokenId, amount);
      await createBurn(wallet, result.hash);
      return await result.wait(5);
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< redeemItem (_tokenId) [${tokenId}] <<<<<`,
        "color: yellow",
        tokenId
      );

    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};
