import { BigNumber, ethers } from "ethers";
import { unlimitAmount } from "/utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContract } from "/utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";
import { getMarketLists } from "./Market";
import { createBurn } from "../utils/api/user-api";

export const smartContractLand = (providerType = false) => {
  if (providerType === true) {
    return smartContract(Config.LAND_CA, Config.LAND_ABI, true);
  } else {
    return smartContract(Config.LAND_CA, Config.LAND_ABI, false);
  }
};

export const getLandMetadata = async (_landId) => {
  if (debug)
    console.log(
      `%c>>>>> getMetadataLand (_landId) [${_landId}] >>>>>`,
      "color: yellow"
    );

  let landMetadata = {};

  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    // const smLand = smartContractLand();

    /** Retrived metadata uri function on block chain  */
    // const metadataURI = await smLand.tokenURI(_tokenId);

    let metadataURI = `${Config.METADATA_URI}/land/${_landId}`;

    /** Call data uri for json meatadata of land */
    const res = await fetch(metadataURI);
    landMetadata = await res.json();
  } /** End Check dApp */

  if (debug)
    console.log(
      `%c<<<<< getMetadataLand (_landId) [${_landId}] <<<<<`,
      "color: yellow",
      landMetadata
    );

  return landMetadata;
};
const getTokensByOwnerOnChain = async (smLand, wallet) => {
  try {
    const landTokens = await smLand.getTokensByOwner(wallet);
    const marketLands = await getMarketLists("land");
    return [landTokens, marketLands];
  } catch (error) {
    await getNftLands(wallet);
  }
};

const getDetailLand = async (smLand, landTokens, marketLandTokenList) => {
  try {
    const lands = [];
    await Promise.all(
      landTokens.map(async (token) => {
        const tokenId = parseInt(BigNumber.from(token)._hex, 16);
        if (!marketLandTokenList.includes(tokenId)) {
          const landDetail = await smLand.getDetailByToken(tokenId);
          let [zone, code, index] = landDetail;

          zone = parseInt(BigNumber.from(zone)._hex, 16);
          code = parseInt(BigNumber.from(code)._hex, 16);
          index = parseInt(BigNumber.from(index)._hex, 16)
            .toString()
            ?.padStart?.(2, "0");

          const res = await fetch(
            `${Config.METADATA_URI}/land/${zone}${code}${index}`
          );
          const landData = await res.json();

          if (landData) {
            landData.tokenId = tokenId;
            landData.codeInt = code;
            landData.index = +index;
          }

          lands.push(landData);
        }
      })
    );
    return lands;
  } catch (error) {
    return false;
  }
};
export const getNftLands = async (wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> getNftLands (_wallet) [${wallet}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] instant smart contract */
      const smLand = smartContractLand(true);

      const fetchData = await getTokensByOwnerOnChain(smLand, wallet);
      if (!fetchData) {
        return;
      }
      const landTokens = fetchData[0];
      const marketLands = fetchData[1];
      const marketLandTokenList = [];
      if (Array.isArray(marketLands) && marketLands.length > 0) {
        for (let i = 0; i < marketLands.length; i++) {
          marketLandTokenList.push(
            parseInt(BigNumber.from(marketLands[i].tokenId)._hex, 16)
          );
        }
      }
      let lands;
      do {
        lands = await getDetailLand(smLand, landTokens, marketLandTokenList);
      } while (!Array.isArray(lands));
      return lands;
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< getNftLands (_wallet) [${wallet}] <<<<<`,
        "color: yellow",
        wallet
      );

    return [];
  } catch (err) {
    console.error(err.message);
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
      const scLand = smartContractLand();

      const marketAddr = Config.MARKET_CA;

      const setApprove = await scLand.setApprovalForAll(marketAddr, true);
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
      const scLand = smartContractLand();

      const marketAddr = Config.MARKET_CA;

      const isApproved = await scLand.isApprovedForAll(wallet, marketAddr);

      return isApproved ? true : false;
    } /** End Check dApp */

    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export const redeemLand = async (tokenId, wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> redeemLand (_tokenId) [${tokenId}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] instant smart contract */
      const smLand = smartContractLand();

      const result = await smLand.redeemNFT(tokenId);

      await createBurn(wallet, result.hash);
      return await result.wait(5);
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< redeemLand (_tokenId) [${tokenId}] <<<<<`,
        "color: yellow",
        tokenId
      );

    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};
