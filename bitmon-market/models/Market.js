import Config from "../configs/config";
import { dAppChecked, smartContract } from "../utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";
import Swal from "sweetalert2";
import { parseEther } from "ethers/lib/utils";
import { smartContractMonster } from "./Monster";
import { smartContractLand } from "./Land";
import { smartContractItem } from "./Item";

export const smartContractMarket = (providerType = false) => {
  if (providerType === true) {
    return smartContract(Config.MARKET_CA, Config.MARKET_ABI, true);
  } else {
    return smartContract(Config.MARKET_CA, Config.MARKET_ABI, false);
  }
};

export const placeInventoryItem = async (
  tokenId,
  amount,
  price,
  expiration = null,
  tokenAddr = null,
  type
) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    try {
      /** [smMonster] instant smart contract */
      const smMarket = smartContractMarket(false);
      let inventoryItemAddr;
      const busdAddr = Config.BUSD_CA;

      if (type === "monster") {
        // sm = smartContractMonster();
        inventoryItemAddr = Config.MONSTER_CA;
      } else if (type === "land") {
        // sm = smartContractLand();
        inventoryItemAddr = Config.LAND_CA;
      } else if (type === "item") {
        // sm = smartContractItem();
        inventoryItemAddr = Config.ITEM_CA;
      }

      const expirationData = new Date();
      expirationData.setDate(expirationData.getDate() + 1);

      price = parseEther(price.toString()).toString();

      const placeItems = await smMarket.placeItem(
        inventoryItemAddr,
        tokenId,
        amount,
        price,
        expirationData.getTime(),
        busdAddr
      );
      const placeItemsTx = await placeItems.wait();

      return placeItemsTx;
    } catch (error) {
      console.error(error.message);
      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
      return false;
    }
  } /** End Check dApp */

  return false;
};

export const placeLand = async (
  tokenId,
  amount,
  price,
  expiration,
  tokenAddr
) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    try {
      /** [smMonster] instant smart contract */
      const scMarket = smartContractMarket(false);

      const landAddr = Config.LAND_CA;
      const busdAddr = Config.BUSD_CA;

      const expirationData = new Date();
      expirationData.setDate(expirationData.getDate() + 1);

      price = parseEther(price).toString();

      const placeItems = await scMarket.placeItem(
        landAddr,
        tokenId,
        amount,
        price,
        expirationData.getTime(),
        busdAddr
      );
      const placeItemsTx = await placeItems.wait();

      return placeItemsTx;
    } catch (error) {
      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
      return false;
    }
  } /** End Check dApp */

  return false;
};

export const placeAsset = async (
  tokenId,
  amount,
  price,
  expiration,
  tokenAddr
) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    try {
      /** [smMarket] instant smart contract */
      const scMarket = smartContractMarket(false);

      const assetAddr = Config.ITEM_CA;
      const busdAddr = Config.BUSD_CA;

      const expirationData = new Date();
      expirationData.setDate(expirationData.getDate() + 1);

      price = parseEther(price).toString();

      const placeItems = await scMarket.placeItem(
        assetAddr,
        tokenId,
        amount,
        price,
        expirationData.getTime(),
        busdAddr
      );
      const placeItemsTx = await placeItems.wait();

      return placeItemsTx;
    } catch (error) {
      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
      return false;
    }
  } /** End Check dApp */

  return false;
};

export const cancelItemFromMarket = async (marketId) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    try{
      /** [smMarket] instant smart contract */
      const scMarket = smartContractMarket(false);

      const cancelItem = await scMarket.cancelItem(marketId);
      const cancelItemTx = await cancelItem.wait();

      return cancelItemTx.status;
    } catch {
      return false;
    }
  }

  return false;
};

export const completeOrderToMarket = async (marketId, amount) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    try{
      /** [smMonster] instant smart contract */
      const scMarket = smartContractMarket(false);

      const buyMarketItem = await scMarket.buyItem(marketId, amount);
      const buyMarketItemTx = await buyMarketItem.wait();

      return buyMarketItemTx.status;
    } catch {
      return false;
    }
  }

  return false;
};

export const getMarketLists = async (listType) => {
  /** Check dApp before action anything */
  try {
    const scMarket = smartContractMarket(true);
    const getItemFromMarket = await scMarket.getItemsList();
    console.log("getItemFromMarket", getItemFromMarket);
    let arr = [];

    if (listType === "monster") {
      for (var i = 0; i < getItemFromMarket.length; i++) {
        if (
          getItemFromMarket[i].available === true &&
          String(getItemFromMarket[i].itemAddress).toLowerCase() === String(Config.MONSTER_CA).toLowerCase()
        ) {
          arr.push(getItemFromMarket[i]);
        }
      }
    } else if (listType === "land") {
      for (var i = 0; i < getItemFromMarket.length; i++) {
        if (
          getItemFromMarket[i].available === true &&
          String(getItemFromMarket[i].itemAddress).toLowerCase() === String(Config.LAND_CA).toLowerCase()
        ) {
          arr.push(getItemFromMarket[i]);
        }
      }
    } else if (listType === "item") {
      for (var i = 0; i < getItemFromMarket.length; i++) {
        if (
          getItemFromMarket[i].available === true &&
          String(getItemFromMarket[i].itemAddress).toLowerCase() === String(Config.ITEM_CA).toLowerCase()
        ) {
          arr.push(getItemFromMarket[i]);
        }
      }
    }
    console.log("Arr00", arr, Config.LAND_CA);

    return arr;

    // return [];
  } catch (err) {
    console.error("getMarketLists error", err.message);
  }
};

export const getItemInfo = async (marketId) => {
  /** Check dApp before action anything */
  // if (await dAppChecked()) {
  const scMarket = smartContractMarket(true);

  const getItemsInfosFromMarket = await scMarket.getMarketItem(marketId);

  return getItemsInfosFromMarket;
  // }
};
