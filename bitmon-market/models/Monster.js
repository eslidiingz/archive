import { BigNumber, ethers, providers } from "ethers";
import { unlimitAmount } from "/utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContract } from "../utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";
import { smartContractLand } from "./Land";
import { smartContractItem } from "./Item";
import { getMarketLists } from "./Market";
import { createBurn } from "../utils/api/user-api";

export const smartContractMonster = (providerType = false) => {
  if (providerType === true) {
    return smartContract(Config.MONSTER_CA, Config.MONSTER_ABI, true);
  } else {
    return smartContract(Config.MONSTER_CA, Config.MONSTER_ABI, false);
  }
};

export const getMonsterMetadata = async (_monsterId) => {
  if (debug)
    console.log(
      `%c>>>>> getMetadataMonster (_monsterId) [${_monsterId}] >>>>>`,
      "color: yellow"
    );

  let monsterMetadata = {};

  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smMonster] instant smart contract */
    // const smMonster = smartContractMonster();

    /** Retrived metadata uri function on block chain  */
    // const metadataURI = await smMonster.tokenURI(_tokenId);

    let metadataURI = `${Config.METADATA_URI}/monster/${_monsterId}`;

    /** Call data uri for json meatadata of monster */
    const res = await fetch(metadataURI);
    monsterMetadata = await res.json();
  } /** End Check dApp */

  if (debug)
    console.log(
      `%c<<<<< getMetadataMonster (_monsterId) [${_monsterId}] <<<<<`,
      "color: yellow",
      monsterMetadata
    );

  return monsterMetadata;
};

export const getMetaDataForMarket = async (_tokenId, type) => {
  if (debug)
    console.log(
      `%c>>>>> getMetaDataForMarket (_tokenId, type) [${_tokenId},${type}] >>>>>`,
      "color: yellow"
    );

  let metaData = {};
  /** [smMonster] instant smart contract */
  // const smMonster = smartContractMonster();
  let sm;

  if (type === "monster") {
    sm = smartContractMonster(true);

    /** Retrived metadata uri function on block chain  */
    metaData = await sm.tokenURI(_tokenId);
  } else if (type === "land") {
    sm = smartContractLand(true);

    /** Retrived metadata uri function on block chain  */
    metaData = await sm.tokenURI(_tokenId);
  } else if (type === "item") {
    sm = smartContractItem(true);

    /** Retrived metadata uri function on block chain  */
    metaData = await sm.uri(_tokenId);
  }

  const res = await fetch(metaData);
  metaData = await res.json();

  /** Call data uri for json meatadata of monster */

  if (debug)
    console.log(
      `%c<<<<< getMetaDataForMarket (_tokenId, type) [${_tokenId},${type}] <<<<<`,
      "color: yellow",
      metaData
    );

  return metaData;
};
const getTokensByOwnerOnChain = async (smMonster, wallet) => {
  try {
    const monsterTokens = await smMonster.getTokensByOwner(wallet);
    const marketMonsters = await getMarketLists("monster");
    return [monsterTokens, marketMonsters];
  } catch (error) {
    await getNftMonsters(wallet);
  }
};

const getDetailMonster = async (
  smMonster,
  monsterTokens,
  marketMonsterTokenList
) => {
  try {
    const monsters = [];

    await Promise.all(
      monsterTokens.map(async (token) => {
        const tokenId = parseInt(BigNumber.from(token)._hex, 16);
        if (!marketMonsterTokenList.includes(tokenId)) {
          const monsterDetail = await smMonster.monsterDetail(tokenId);
          monsters.push({
            tokenId,
            monsterId: parseInt(BigNumber.from(monsterDetail)._hex, 16),
          });
        }
      })
    );
    return monsters;
  } catch (error) {
    return false;
  }
};
export const getNftMonsters = async (wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> getNftMonsters (_wallet) [${wallet}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] instant smart contract */
      const smMonster = smartContractMonster();

      const fetchData = await getTokensByOwnerOnChain(smMonster, wallet);
      if (!fetchData) {
        return;
      }
      const monsterTokens = fetchData[0];
      const marketMonsters = fetchData[1];
      const marketMonsterTokenList = [];

      if (Array.isArray(marketMonsters)) {
        for (let i = 0; i < marketMonsters.length; i++) {
          marketMonsterTokenList.push(
            parseInt(BigNumber.from(marketMonsters[i].tokenId)._hex, 16)
          );
        }
      }

      let monsters;
      do {
        monsters = await getDetailMonster(
          smMonster,
          monsterTokens,
          marketMonsterTokenList
        );
      } while (!Array.isArray(monsters));
      return monsters;
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< getNftMonsters (wallet) [${wallet}] <<<<<`,
        "color: yellow",
        wallet
      );

    return [];
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

export const redeemMonster = async (tokenId, wallet) => {
  try {
    if (debug) {
      console.log(
        `%c>>>>> redeemMonster (_tokenId) [${tokenId}] >>>>>`,
        "color: yellow"
      );
    }
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMonster] instant smart contract */
      const smMonster = smartContractMonster();

      const result = await smMonster.redeemNFT(tokenId);
      await createBurn(wallet, result.hash);
      return await result.wait(5);
    } /** End Check dApp */

    if (debug)
      console.log(
        `%c<<<<< redeemMonster (_tokenId) [${tokenId}] <<<<<`,
        "color: yellow",
        tokenId
      );

    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export const setApproveForAll = async () => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    let provider = web3Provider();
    let signer = provider.getSigner();
    let wallet = await signer.getAddress();

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
    const scMonster = smartContractMonster();

    const marketAddr = Config.MARKET_CA;

    const setApprove = await scMonster.setApprovalForAll(marketAddr, true);
    const setApproveTx = await setApprove.wait();

    return setApproveTx ? true : false;
  } /** End Check dApp */

  return false;
};

export const getApproveForAll = async () => {
  try {
    /** Check dApp before action anything */
    if (await dAppChecked()) {
      let provider = web3Provider();
      let signer = provider.getSigner();
      let wallet = await signer.getAddress();

      /** [smMonster] instant smart contract */
      const scMonster = smartContractMonster();

      const marketAddr = Config.MARKET_CA;

      const isApproved = await scMonster.isApprovedForAll(wallet, marketAddr);

      return isApproved ? true : false;
    } /** End Check dApp */

    return false;
  } catch {
    return false;
  }
};
