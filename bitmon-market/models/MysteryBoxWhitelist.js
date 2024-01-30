import { ethers } from "ethers";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContract,
  web3Provider,
} from "/utils/providers/connector";

export const smartContractWhitelist = (_withJsonRPC = false) => {
  return smartContract(
    Config.MYSTERYBOX_WHITELIST_CA,
    Config.MYSTERYBOX_WHITELIST_ABI,
    _withJsonRPC
  );
};

export const setWhiteListForUsers = async (
  _wallet = [],
  _typeBox = [],
  _box = [],
  _amount = []
) => {
  try {
    if (dAppChecked()) {
      if (debug)
        console.log(
          `%c>>>>> isWhitelistOfBox (_wallet, _boxType, _box) [${_box}] >>>>>`,
          "color: yellow",
          _wallet,
          _typeBox,
          _box
        );

      const sm = smartContractWhitelist();

      if (
        _wallet.length === _typeBox.length &&
        _wallet.length === _box.length &&
        _wallet.length === _amount.length
      ) {
        let _setWhiteList = await sm.setWhitelist(
          _wallet,
          _typeBox,
          _box,
          _amount
        );
        let tx = await _setWhiteList.wait();
        return tx;
      } else {
        return false;
      }
    }
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

/** Monster */
export const isWhitelistOfBox = async (_wallet, _boxType, _box) => {
  let results = {
    status: "error",
    stage: "whitelistChecking",
    error: true,
    message: "Whitelist is checking.",
    data: {
      isWhiteList: false,
    },
  };

  /** Check dApp connected */
  if (dAppChecked()) {
    if (debug)
      console.log(
        `%c>>>>> isWhitelistOfBox (_wallet, _boxType, _box) [${_box}] >>>>>`,
        "color: yellow",
        _wallet,
        _boxType,
        _box
      );

    /** [smartContractWhitelist] instant smart contract */
    const sm = smartContractWhitelist();

    let whitelistAmount = await sm.getWhitelist(_wallet, _boxType, _box);
    let whitelistStatus = whitelistAmount > 0 ? true : false;

    results = {
      status: "",
      stage: "whitelist",
      error: false,
      message:
        whitelistStatus === true
          ? "Your are whitelist."
          : "Your are not whitelist.",
      data: {
        isWhiteList: whitelistStatus,
      },
    };
  } /** End check dapp connected */

  if (debug)
    console.log(
      `%c<<<<< isWhitelistOfBox (_wallet, _boxType, _box) [${_box}] <<<<<`,
      "color: yellow",
      results
    );

  return results;
};

/** Monster */
export const hasCreateWhitelistRole = async (_wallet) => {
  /** Check dApp connected */
  if (dAppChecked()) {
    /** [smartContractWhitelist] instant smart contract */
    const sm = smartContractWhitelist();

    let isWhitelist = await sm.hasRole(Config.WHITELIST_ROLE, _wallet);
    return isWhitelist;
  } /** End check dapp connected */
};
