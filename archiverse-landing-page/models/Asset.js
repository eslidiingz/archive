import { BigNumber, ethers, providers } from "ethers";
import { formatUnits, id } from "ethers/lib/utils";
import { getLogsEvent } from "/utils/logs/getLogs";
import { objectForParams, objectForParamsNotKey } from "../utils/misc";
import { getWalletAddress } from "../utils/providers/connector";
import { getCollection, gqlCollectionReturning } from "./Collection";
import { gqlMarketReturning } from "./Marketplace";
import { gqlMutation, gqlQuery } from "./GraphQL";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContact,
  web3Provider,
} from "/utils/providers/connector";
import { createUser, getUsers } from "./User";
import Swal from "sweetalert2";

export const smartContractAsset = (_withJsonRPC = false) => {
  return smartContact(Config.ASSET_CA, Config.ASSET_ABI, _withJsonRPC);
};

/** GraphQL */
export const gqlTagReturning = `{
  id
  name
}`;

export const getTags = async (_where = null) => {
  let query = `
    tags ${_where ? `(${_where})` : ""}
    ${gqlTagReturning}
  `;

  return gqlQuery(query);
};

export const createTags = async (_tags) => {
  let arrTags = [];
  let arrStringTags = [];

  /** Make dara array tags */
  _tags.map((tag) => {
    arrTags.push(tag.text);
    arrStringTags.push('"' + tag.text + '"');
  });

  /** Check tags is exsiting on database */
  let exsitTags = (await getTags(`where: {name: {_in: [${arrStringTags}]}}`))
    .data;

  /** Make data array existing tags */
  let arrExsitTags = [];
  if (exsitTags.length > 0) {
    exsitTags.map((item) => {
      arrExsitTags.push(item.name);
    });
  }

  /** Intersection tags between existing tag and parameter tags */
  let diff = arrTags.filter((d) => !arrExsitTags.includes(d));

  let objInsertTags = diff.map((name) => {
    return { name: name };
  });

  let mutation = `
    insert_tags(objects: ${objectForParamsNotKey(objInsertTags)}) {
      returning ${gqlTagReturning}
    }
  `;

  /** Insert intersection tags  */
  const tagsCreated = await gqlMutation(mutation);

  /** Retrived existing all tags params again */
  exsitTags = (await getTags(`where: {name: {_in: [${arrStringTags}]}}`)).data;

  return exsitTags;
};

export const gqlAssetReturning = `{
  id
  collectionId
  creator
  metadata
  nftAddress
  orderId
  owner
  owner_address {
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
  }
  tags
  tokenId
  view
  createdAt
  updatedAt
  collection ${gqlCollectionReturning}
}`;

export const getMetadata = async (_where = null) => {
  let query = `
    assets ${_where ? `(where: ${_where})` : ""}
    ${gqlAssetReturning}
  `;

  return gqlQuery(query);
};

export const getAssets = async (_where = null) => {
  let query = `
    assets ${_where ? `(where: ${_where})` : ""}
    ${gqlAssetReturning}
  `;

  return gqlQuery(query);
};

export const getAssetsDistinct = async (field = "owner", _where = null) => {
  let query = `
    assets ${_where ? `(distinct_on: ${field}, where: ${_where})` : ""}
    ${gqlAssetReturning}
  `;
  return gqlQuery(query);
};

export const createAsset = async (
  _asset,
  _contractAddress = Config.ASSET_CA
) => {
  if (debug) {
    console.log(
      `%c>>>>> createAsset(_asset, _contractAddress) >>>>>`,
      "color: yellow"
    );
    console.log(`%c>>>>> _metadata`, "color: pink", _asset);
    console.log(`%c>>>>> _contractAddress`, "color: pink", _contractAddress);
  }

  let _tags = [];
  /** Has data tags is call function createTags  */
  if (_asset.metadata.tags.length > 0) {
    _tags = await createTags(_asset.metadata.tags);

    let _metaTags = _tags.map((t) => t.name);

    _asset.metadata.tags = _metaTags;
  }

  try {
    let mutation = `
    insert_assets_one(object: {
      metadata: ${objectForParams(_metadata)},
      nftAddress: "${_contractAddress}",
      tags: ${objectForParamsNotKey(_tags)}
    }) ${gqlAssetReturning}`;

    // return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR createMetadata()==========`,
      "color: red",
      error
    );
  }
};

/** createMetadata() store data to database */
export const createMetadata = async (
  _metadata,
  _contractAddress = Config.ASSET_CA
) => {
  if (debug) {
    console.log(
      `%c>>>>> createMetadata(_metadata, _contractAddress) >>>>>`,
      "color: yellow"
    );
    console.log(`%c>>>>> _metadata`, "color: pink", _metadata);
    console.log(`%c>>>>> _contractAddress`, "color: pink", _contractAddress);
  }

  let _tags = [];
  /** Has data tags is call function createTags  */
  if (_metadata.tags.length > 0) {
    _tags = await createTags(_metadata.tags);

    let _metaTags = _tags.map((t) => t.name);

    _metadata.tags = _metaTags;
  }

  try {
    let mutation = `
    insert_assets_one(object: {
      metadata: ${objectForParams(_metadata)},
      nftAddress: "${_contractAddress}",
      tags: ${objectForParamsNotKey(_tags)}
    }) ${gqlAssetReturning}`;

    return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR createMetadata()==========`,
      "color: red",
      error
    );
  }
};

export const updateAsset = async (_set, _where) => {
  if (debug) {
    console.log(`%c>>>>> updateAsset(_where, _set) >>>>>`, "color: yellow");
    console.log(`%c>>>>> _where`, "color: pink", _where);
    console.log(`%c>>>>> _set`, "color: pink", _set);
  }

  try {
    let mutation = `
      update_assets(where: ${_where}, _set: {${_set}}) {
        returning ${gqlAssetReturning}
      }
    `;

    return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR updateAsset() ==========`,
      "color: red",
      error
    );
  }
};

export const updateMetadataById = async (_id, _set) => {
  if (debug) {
    console.log(`%c>>>>> updateMetadataById(_id, _set) >>>>>`, "color: yellow");
    console.log(`%c>>>>> _id`, "color: pink", _id);
    console.log(`%c>>>>> _set`, "color: pink", _set);
  }

  try {
    let mutation = `
    update_assets_by_pk(
      pk_columns: {id: ${_id}}, _set: {${_set}}
    ) ${gqlAssetReturning}`;

    return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR updateMetadataById() ==========`,
      "color: red",
      error
    );
  }
};

export const myCollection = async (_wallet) => {
  let query = `
  collections(where:{
    creatorWallet:{_eq:"${_wallet}"}
  }) ${gqlCollectionReturning}
  `;

  return await gqlQuery(query);
};

export const createCollection = async (_name) => {
  if (debug) {
    console.log(`%c>>>>> createCollection(_name) >>>>>`, "color: yellow");
    console.log(`%c>>>>> _name`, "color: pink", _name);
  }

  const wallet = await getWalletAddress();

  try {
    let mutation = `
      insert_collections_one(object: {
        name: "${_name}",
        creatorWallet: "${wallet}",
        isArchiverse: true
      })
      ${gqlCollectionReturning}
    `;

    return await gqlMutation(mutation);
  } catch (error) {
    console.log(
      `%c========== ERROR createCollection() ==========`,
      "color: red",
      error
    );
  }
};

export const mintAsset = async (_metadata) => {
  if (debug)
    console.log(
      `%c>>>>> mintAsset(_metadata) >>>>>`,
      "color: yellow",
      _metadata
    );

  /** check DApp is already */
  if (await dAppChecked()) {
    /** Get instant of smartcontract */
    const smAsset = smartContractAsset();
    console.log(smAsset);

    const result = await smAsset.safeMint(
      _metadata.amount,
      _metadata.loyaltyFee
    );
    const assetMinted = await result.wait();

    let data = {};
    console.log("result", result);
    console.log("assetMinted", assetMinted);

    if (assetMinted) {
      let args = assetMinted?.events?.find(
        (e) => e.event === "SafeMintEvent"
      )?.args;
      if (!args) {
        console.error("SafeMintEvent isn't defined");
        Swal.fire("Error", "Mint Asset Fail", "error");
        return;
      }
      console.log("args", args);

      let { from, to, tokenIds } = args;

      const tokenIdsResponse = tokenIds.map(async (_token) => {
        const body = {
          json: _metadata,
          tokenId: `${parseInt(formatUnits(_token, "wei"))}`,
        };
        const response = await fetch(`/api/upload`, {
          method: "post",
          body: JSON.stringify(body),
        });

        return await response.json();
      });

      console.log(tokenIdsResponse);

      // tokenId = parseInt(formatUnits(args.tokenId, "wei"));

      let _tags = [];
      /** Has data tags is call function createTags  */
      if (_metadata.tags.length > 0) {
        _tags = await createTags(_metadata.tags);

        let _metaTags = _tags.map((t) => t.name);

        _metadata.tags = _metaTags;
      }

      let collectionId;
      /** Storing data collection of wallet to database */
      if (_metadata.collectionOption === "newCollection") {
        collectionId = (await createCollection(_metadata.collectionName)).data
          .id;
      } else {
        collectionId = (
          await getCollection(`{name: {_eq: "${_metadata.collectionName}"}}`)
        ).data[0].id;
      }

      // console.log(collectionId);
      let assetObjectDataList = tokenIds.map((tokenId) => {
        return `{
          collectionId: ${collectionId},
          creator: "${to}",
          metadata: ${objectForParams(_metadata)},
          nftAddress: "${smAsset.address}",
          owner: "${to}",
          tags: ${objectForParamsNotKey(_tags)},
          tokenId: ${parseInt(formatUnits(tokenId, "wei"))},
          isArchiverse: true
        }`;
      });

      // console.log(assetObjectDataList);

      let mutation = `insert_assets(objects: [${assetObjectDataList}]) { returning ${gqlAssetReturning} }`;

      console.log("mutation", mutation);
      // return data;

      // let mutation = `
      //   insert_assets_one(object: {
      //     collectionId: ${collectionId},
      //     creator: "${to}",
      //     metadata: ${objectForParams(_metadata)},
      //     nftAddress: "${smAsset.address}",
      //     owner: "${to}",
      //     tags: ${objectForParamsNotKey(_tags)},
      //     tokenId: ${tokenId},
      //   }) ${gqlAssetReturning}
      // `;

      data = (await gqlMutation(mutation)).data;
      data.res = result;

      console.log("rs data::", data);

      /** Add new user if not exist */
      let user = (await getUsers(`{wallet: {_eq: "${to}"}}`)).data;

      if (user.length == 0) {
        let createdUser = await createUser(to);
        if (debug) {
          console.log(`%c>>>>> createUser(_wallet) >>>>>`, "color: orange");
          console.log(`%c>>>>> _wallet`, "color: pink", to);
          console.log(`%c>>>>> createdUser`, "color: pink", createdUser);
        }
      }
    }

    if (debug)
      console.log(
        `%c<<<<< mintAsset(_metadata) <<<<<`,
        "color: yellow",
        _metadata,
        data
      );

    return data;
  } /** End check DApp */
};

export const myNftList = async (_condition = null) => {
  /** check DApp is already */
  if (await dAppChecked()) {
    // const eventTransfered = await getTopicTransferEvent();
    // console.log("eventTransfered", eventTransfered);

    let { data } = await getAssets(_condition);

    return data;
  } /** End check DApp is already */
};

export const getTopicTransferEvent = async () => {
  const sm = smartContractAsset();
  const topic = id("Transfer(address,address,uint256)");

  const events = await getLogsEvent(
    sm,
    sm.address,
    Config.ASSET_BLOCK_START,
    topic
  );

  const args = events.map((i) => i.args);

  return await Promise.all(
    args.map(async (i) => {
      return {
        from: i.from,
        to: i.to,
        tokenId: formatUnits(i.tokenId, "wei"),
      };
    })
  );
};

export const openMonsterBox = async (_boxType, _openType) => {
  let results = {
    status: "",
    stage: "",
    message: "",
  };

  if (debug)
    console.log(
      `%c>>>>> openMonsterBox (_boxType, _openType) [${
        (_boxType, _openType)
      }] >>>>>`,
      "color: yellow"
    );

  /** Check dApp connected */
  if (await dAppChecked()) {
    /** [mysteryBox] instant smart contract */
    const mysteryBox = smartContractMysteryBox();

    try {
      const openTypeHash = id(_openType);

      if (debug)
        console.log(
          `%c========== ${_boxType} openTypeHas = ${openTypeHash} ==========`,
          "color: pink"
        );

      const openBox = await mysteryBox.gachaMonster(_boxType, openTypeHash);
      const openBoxTx = await openBox.wait();

      if (debug) {
        console.log("%c===== openBoxTx =====", "color: pink", openBoxTx);
      }

      const eventLatestIndex = openBoxTx?.events.length - 1;

      let args = openBoxTx?.events[eventLatestIndex]?.args;

      let data = {
        boxType: _boxType,
        monsterId: formatUnits(args[2], "wei"),
        tokenId: formatUnits(args[3], "wei"),
      };
      // let data = {
      //   boxType: boxType,
      //   monsterId: formatUnits(monsterId, "wei"),
      //   price: formatUnits(price, "wei"),
      //   tokenId: formatUnits(tokenId, "wei"),
      // };

      results = {
        status: "success",
        error: false,
        stage: "opened",
        message: "Mystery box has been opened.",
        data: data,
      };
    } catch (error) {
      console.log(
        `%c========== Error gachaMonster(_boxType, _openType) [${
          (_boxType, _openType)
        }] ==========`,
        "color: red"
      );
      console.log(error);

      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< openMonsterBox (_boxType, _openType) [${
        (_boxType, _openType)
      }] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};
