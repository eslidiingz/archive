import { ethers, utils } from "ethers";
import Swal from "sweetalert2";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContract,
  web3Provider,
} from "../utils/providers/connector";
import { allowanced, balanceOfWallet } from "./Token";
import { checkTransaction } from "../utils/misc";
import { formatEther, formatUnits, id } from "ethers/lib/utils";

export const smartContractMysteryBox = (_withJsonRPC = false) => {
  return smartContract(
    Config.MYSTERYBOX_CA,
    Config.MYSTERYBOX_ABI,
    _withJsonRPC
  );
};

/** Monster */
export const mysteryBoxReadinessCheckMonster = async (_boxType) => {
  let results = {
    status: "",
    stage: "",
    message: "",
  };

  /** Check dApp connected */
  if (await dAppChecked()) {
    let provider = web3Provider();
    let signer = provider.getSigner();
    let wallet = await signer.getAddress();

    if (debug)
      console.log(
        `%c>>>>> mysteryBoxReadinessCheckMonster (_boxType) [${_boxType}] >>>>>`,
        "color: yellow"
      );
    if (debug) console.log("%c===== wallet =====>", "color: skyblue", wallet);

    /** Check wallet is connected */
    if (!wallet) {
      Swal.fire(
        "Warning",
        "Please, Connect wallet before make a transaction.",
        "warning"
      );
      return;
    }

    /** Retrived balance (Default BUSD) of wallet */
    let balance = await balanceOfWallet(wallet);

    /** Convert balance wei to eth */
    let balanceEth = ethers.utils.formatEther(balance);

    /** [mysteryBox] instant smart contract */
    let mysteryBox = smartContractMysteryBox(true);
    /** Pricing [Common=25, Rare=60, Epic=150, Legendary=250, Immortal=500] */
    // let boxPrice = await mysteryBox.getPriceMysteryBox(_boxType);

    let boxPricing = {
      Common: 25,
      Rare: 60,
      Epic: 150,
      Legendary: 250,
      Immortal: 500,
    };

    /** Box Pricing call data on chain (Waiting Deploy a new Contract)*/
    let boxPrice = boxPricing[_boxType]; // eth

    if (debug)
      console.log(
        `%c===== [Your balance (eth), Box Price] =====>`,
        "color: skyblue",
        [parseInt(balanceEth), boxPrice]
      );

    /** Check balance is enought */
    if (parseInt(balanceEth) < parseInt(boxPrice)) {
      Swal.fire("Warning", "Your token is not enought.", "warning");
      return;
    }

    /** Check token allowance */
    let allowanceAmount = await allowanced(
      wallet,
      Config.MYSTERYBOX_CA,
      Config.BUSD_CA,
      true
    );

    if (ethers.utils.formatEther(allowanceAmount) < boxPrice) {
      results = {
        status: "",
        stage: "approve",
        error: false,
        message: "Please, Approve token",
      };
    } else {
      results = {
        status: "",
        stage: "open",
        error: false,
        message: "Can open mystery box.",
      };
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< mysteryBoxReadinessCheckMonster (_boxType) [${_boxType}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
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
      console.log("openBoxTx", openBoxTx);
      if (debug) {
        console.log("%c===== openBoxTx =====", "color: pink", openBoxTx);
      }
      const eventName = utils.id(
        "eOpenGachaMonster(string,uint256,uint256,uint256)"
      );
      const eventFilter = openBoxTx?.events.filter(
        (element) => element.topics[0] == eventName
      );

      let args = eventFilter[0]?.args;
      let data = {
        boxType: _boxType,
        monsterId: formatUnits(args[2], "wei"),
        tokenId: formatUnits(args[3], "wei"),
      };
      console.log("data", data);
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

export const getMonsterBalanceOfBox = async (_boxType) => {
  if (debug)
    console.log(
      `%c>>>>> getMonsterBalanceOfBox (_boxType) [${_boxType}] >>>>>`,
      "color: yellow"
    );

  /** Check dApp connected */
  // if (await dAppChecked()) {
  /** [mysteryBox] instant smart contract */
  try {
    const mysteryBox = smartContractMysteryBox(true);

    const resMonster = await mysteryBox.getMysteryMonster(_boxType);
    if (debug);
    console.log(
      `%c<<<<<< getMonsterBalanceOfBox (_boxType) [${_boxType}] <<<<<<`,
      "color: yellow"
    );

    return formatUnits(resMonster.monsterBalance, "wei");
  } catch (error) {
    // console.log(error);
  }
  // } /** End Check dApp */
};

/** Land */
export const getPricePerBoxOfLand = async (_zone) => {
  /** Check dApp connected */
  if (await dAppChecked()) {
    let smMysteryBox = smartContractMysteryBox();

    let { price } = await smMysteryBox.getMysteryLand(_zone);

    return parseInt(formatUnits(price, "ether"));
  } /** End Check dApp */
};

export const mysteryBoxReadinessCheckLand = async (_zone) => {
  let results = {
    status: "",
    stage: "",
    error: true,
    message: "",
  };

  /** Check dApp connected */
  if (await dAppChecked()) {
    let provider = web3Provider();
    let signer = provider.getSigner();
    let wallet = await signer.getAddress();

    if (debug)
      console.log(
        `%c>>>>> mysteryBoxReadinessCheckLand (_zone) [${_zone}] >>>>>`,
        "color: yellow"
      );
    if (debug) console.log("%c===== wallet =====>", "color: skyblue", wallet);

    /** Check wallet is connected */
    if (!wallet) {
      Swal.fire(
        "Warning",
        "Please, Connect wallet before make a transaction.",
        "warning"
      );
      return;
    }

    /** Retrived balance (Default BUSD) of wallet */
    let balance = await balanceOfWallet(wallet);

    /** Convert balance wei to eth */
    let balanceEth = ethers.utils.formatEther(balance);

    let pricePerBox = await getPricePerBoxOfLand(_zone);

    if (debug)
      console.log(
        `%c===== [Your balance (eth), Box Price] =====>`,
        "color: skyblue",
        [parseInt(balanceEth), pricePerBox]
      );

    /** Check balance is enought */
    if (parseInt(balanceEth) < parseInt(pricePerBox)) {
      Swal.fire("Warning", "Your token is not enought.", "warning");
      return;
    }

    /** Check token allowance */
    let allowanceAmount = await allowanced(
      wallet,
      Config.MYSTERYBOX_CA,
      Config.BUSD_CA,
      true
    );

    if (ethers.utils.formatEther(allowanceAmount) < pricePerBox) {
      results = {
        status: "",
        stage: "approve",
        error: false,
        message: "Please, Approve token",
      };
    } else {
      results = {
        status: "",
        stage: "open",
        error: false,
        message: "Can open mystery box.",
      };
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< mysteryBoxReadinessCheckLand (_zone) [${_zone}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};

export const openLandBox = async (_openType) => {
  let results = {
    status: "",
    error: true,
    stage: "",
    message: "",
  };

  if (debug)
    console.log(
      `%c>>>>> openLandBox(_openType) [${_openType}] >>>>>`,
      "color: yellow"
    );

  /** Check dApp connected */
  if (await dAppChecked()) {
    /** [mysteryBox] instant smart contract */
    const mysteryBox = smartContractMysteryBox();

    try {
      const landZoneOpened = 5;
      let _zone = 0;

      for (let zoneId = 1; zoneId <= landZoneOpened; zoneId++) {
        const landBalance = await mysteryBox.getMysteryLand(zoneId);
        const landSupply = landBalance.landId.length;
        _zone = zoneId;

        if (debug) console.log("landSupply", zoneId, landSupply);

        if (landSupply > 0) {
          break;
        }
      }

      if (debug) console.log("_zone", _zone);
      // return results;

      const openTypeHash = id(_openType);
      const openBox = await mysteryBox.gachaLand(_zone, openTypeHash, {
        gasLimit: 564268,
      });
      const openBoxTx = await openBox.wait();

      const eventName = utils.id(
        "eOpenGachaLand(uint256,uint256,uint256,uint256)"
      );
      const eventFilter = openBoxTx?.events.filter(
        (element) => element.topics[0] == eventName
      );

      let { zone, price, landId, tokenId } = eventFilter[0]?.args;

      if (debug)
        console.log(
          `%c========== [zone, price, landId, tokenId] = ${zone} ${price} ${landId} ${tokenId} ==========`,
          "color: pink"
        );

      let data = {
        zone: zone,
        landId: parseInt(zone + "" + formatUnits(landId, "wei")),
        price: formatUnits(price, "wei"),
        tokenId: formatUnits(tokenId, "wei"),
      };

      results = {
        status: "success",
        error: false,
        stage: "opened",
        message: "Mystery land box has been opened.",
        data: data,
      };
    } catch (error) {
      console.log(
        `%c========== Error gachaLand(_openType) [${_openType}] ==========`,
        "color: red"
      );
      console.log(error);

      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< openLandBox (_openType) [${_openType}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};

export const getLandBalance = async (_zone) => {
  /** Check dApp connected */
  // if (await dAppChecked()) {
  try {
    const smMysteryBox = smartContractMysteryBox(true);

    const landZoneOpened = 5;
    let landTotalSupply = 0;

    for (let zoneId = 1; zoneId <= landZoneOpened; zoneId++) {
      const landBalance = await smMysteryBox.getMysteryLand(zoneId);
      const landSupply = landBalance.landId.length;

      landTotalSupply += landSupply;
    }

    return parseInt(landTotalSupply);
  } catch (error) {}
  // } /** End Check dApp */
};

/** Item */
export const getPricePerBoxOfItem = async (_zone) => {
  if (debug)
    console.log(
      `%c>>>>> getPricePerBoxOfItem(_zone) [${_zone}] >>>>>`,
      "color: yellow"
    );

  /** Check dApp connected */
  if (await dAppChecked()) {
    let smMysteryBox = smartContractMysteryBox();

    let { price } = await smMysteryBox.getMysteryItem(_zone);

    if (debug)
      console.log(
        `%c<<<<< getPricePerBoxOfItem(_zone) [${_zone}] <<<<<`,
        "color: yellow",
        formatUnits(price, "ether")
      );

    return parseInt(formatUnits(price, "ether"));
  }
};

export const mysteryBoxReadinessCheckItem = async (_zone) => {
  let results = {
    status: "",
    stage: "",
    error: true,
    message: "",
  };

  /** Check dApp connected */
  if (await dAppChecked()) {
    let provider = web3Provider();
    let signer = provider.getSigner();
    let wallet = await signer.getAddress();

    if (debug)
      console.log(
        `%c>>>>> mysteryBoxReadinessCheckItem (_zone) [${_zone}] >>>>>`,
        "color: yellow"
      );
    if (debug) console.log("%c===== wallet =====>", "color: skyblue", wallet);

    /** Check wallet is connected */
    if (!wallet) {
      Swal.fire(
        "Warning",
        "Please, Connect wallet before make a transaction.",
        "warning"
      );
      return;
    }

    /** Retrived balance (Default BUSD) of wallet */
    let balance = await balanceOfWallet(wallet);

    /** Convert balance wei to eth */
    let balanceEth = ethers.utils.formatEther(balance);

    let pricePerBox = await getPricePerBoxOfItem(_zone);

    if (debug)
      console.log(
        `%c===== [Your balance (eth), Box Price] =====>`,
        "color: skyblue",
        [parseInt(balanceEth), pricePerBox]
      );

    /** Check balance is enought */
    if (parseInt(balanceEth) < parseInt(pricePerBox)) {
      Swal.fire("Warning", "Your token is not enought.", "warning");
      return;
    }

    /** Check token allowance */
    let allowanceAmount = await allowanced(
      wallet,
      Config.MYSTERYBOX_CA,
      Config.BUSD_CA,
      true
    );

    if (ethers.utils.formatEther(allowanceAmount) < pricePerBox) {
      results = {
        status: "",
        stage: "approve",
        error: false,
        message: "Please, Approve token",
      };
    } else {
      results = {
        status: "",
        stage: "open",
        error: false,
        message: "Can open mystery box.",
      };
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< mysteryBoxReadinessCheckItem (_zone) [${_zone}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};

export const openItemBox = async (_zone, _openType) => {
  let results = {
    status: "",
    error: true,
    stage: "",
    message: "",
  };

  if (debug)
    console.log(
      `%c>>>>> openItemBox(_zone, _openType) [${(_zone, _openType)}] >>>>>`,
      "color: yellow"
    );

  /** Check dApp connected */
  if (await dAppChecked()) {
    /** [mysteryBox] instant smart contract */
    const mysteryBox = smartContractMysteryBox();

    try {
      const openTypeHash = id(_openType);
      const openBox = await mysteryBox.gachaItem(_zone, openTypeHash, {
        gasLimit: 338936,
      });

      const openBoxTx = await openBox.wait();

      const eventName = utils.id("eOpenGachaItem(uint256,uint256,uint256)");
      const eventFilter = openBoxTx?.events.filter(
        (element) => element.topics[0] == eventName
      );

      let { price, itemId, boxType } = eventFilter[0]?.args;

      let data = {
        itemId: formatUnits(itemId, "wei"),
        price: formatUnits(price, "wei"),
        boxType: formatUnits(boxType, "wei"),
      };

      results = {
        status: "success",
        error: false,
        stage: "opened",
        message: "Mystery item box has been opened.",
        data: data,
      };
    } catch (error) {
      console.log(
        `%c========== Error gachaItem(_zone, _openType) [${
          (_zone, _openType)
        }] ==========`,
        "color: red"
      );
      console.log(error);

      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
    }
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< openItemBox (_zone, _openType) [${(_zone, _openType)}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};

export const getItemSold = async () => {
  /** Check dApp connected */
  // if (await dAppChecked()) {
  try {
    let smMysteryBox = smartContractMysteryBox(true);

    let itemSold = await smMysteryBox.openItemBox();

    return formatUnits(itemSold, "wei");
    // } /** End Check dApp */
  } catch (error) {}
};
