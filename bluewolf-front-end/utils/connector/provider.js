import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, Contract } from "ethers";
import Config from "utils/config";
import Swal from "sweetalert2";

// 97: "https://data-seed-prebsc-1-s1.binance.org:8545",
// 56: "https://bsc-dataseed.binance.org/",

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545",
        56: "https://bsc-dataseed.binance.org",
      },
      chainId: Config.CHAIN_ID,
    },
  },
};

export function modalConnect() {
  if (typeof window.ethereum === "undefined") return null;
  return new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });
}

export function connectProvider() {
  if (typeof window.ethereum === "undefined") return null;
  return new providers.Web3Provider(window.ethereum);
}

export function web3Provider(_instance = null, _withJsonRPC = false) {
  if (_withJsonRPC === true) {
    return new providers.JsonRpcProvider(Config.RPC);
  } else {
    if (typeof window.ethereum === "undefined") return null;

    const instance = _instance ? _instance : window.ethereum;
    return new providers.Web3Provider(instance);
  }

  // return new providers.Web3Provider(instance);
}

export const dAppChecked = async () => {
  let status = false;
  if (typeof window.ethereum === "undefined") {
    return status;
  } else {
    status = true;
  }
  return status;
};

export const smartContact = async (
  _contractAddress,
  abi,
  metamaskConnected
) => {
  let web3Provider;
  let instantSmartContract;

  if (metamaskConnected === false) {
    web3Provider = new providers.JsonRpcProvider(Config.RPC_URL);

    instantSmartContract = new Contract(_contractAddress, abi, web3Provider);
  } else {
    web3Provider = await connectProvider();
    const network = await web3Provider?.getNetwork();

    if (network.chainId === Config.CHAIN_ID) {
      const signer = web3Provider.getSigner();
      instantSmartContract = new Contract(_contractAddress, abi, signer);
    } else {
      Swal.fire("Warning", "Please, Switch Chain", "warning");
      return;
    }
  }
  return instantSmartContract;
};

export const getAccount = async () => {
  try {
    const web3Provider = connectProvider();
    let account = null;
    if (web3Provider === null) {
    } else {
      const signer = web3Provider.getSigner();
      account = await signer.getAddress();
    }
    return account;
  } catch (error) {}
};
