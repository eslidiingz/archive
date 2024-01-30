import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Contract, providers } from "ethers";
import Swal from "sweetalert2";
import Config, { debug } from "../../configs/config";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
  },
};

export const web3Modal = () => {
  if (typeof window.ethereum === "undefined") return null;

  return new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: false, // optional
    providerOptions, // required
  });
};

export const web3Provider = (
  _instance = null,
  _withJsonRPC = false,
  rpc = Config.RPC
) => {
  if (_withJsonRPC === true) {
    return new providers.JsonRpcProvider(rpc);
  } else {
    if (typeof window.ethereum === "undefined") return null;

    const instance = _instance ? _instance : window.ethereum;
    return new providers.Web3Provider(instance);
  }

  // return new providers.Web3Provider(instance);
};

export const connectWallet = async (walletAction) => {
  if (debug)
    console.log(`%c========== Connect wallet ==========`, "color: orange");
  if (typeof window.ethereum === "undefined") {
    Swal.fire(
      "Warning",
      "Please, Install metamask extension to connect DApp",
      "warning"
    );
    return;
  }

  const _web3Modal = web3Modal();

  try {
    const _wInstance = await _web3Modal.connect();
    const _wProvider = web3Provider(_wInstance);
    const signer = _wProvider.getSigner();
    let walletAddress = await signer.getAddress();
    walletAction.store(walletAddress);
    console.log(
      "🚀 ~ file: connector.js ~ line 61 ~ connectWal ~ walletAction",
      walletAction
    );

    // await switchNetwork(Config.CHAIN_ID);
    // await switchChainID();
  } catch (error) {
    Swal.fire("Error", error.toString().replace("Error: ", ""), "error");
  }
};

const getNetworkId = async () => {
  try {
    const provider = web3Provider();
    const { chainId } = await provider?.getNetwork();

    return chainId;
  } catch (error) {
    console.log(error);
  }
};

export const switchNetwork = async (chainId = Config.CHAIN_ID) => {
  console.log(
    "🚀 ~ file: connector.js ~ line 84 ~ switchNetwork ~ chainId",
    chainId
  );
  const currentChainId = await getNetworkId();

  if (currentChainId !== chainId) {
    try {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(chainId).toString() }],
        })
        .then((res) => {
          location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      if (error.code === 4902) {
        console.log("add chain");
      }
    }
  }
};

export const switchChainID = async (chainId = Config.CHAIN_ID) => {
  console.log(
    "🚀 ~ file: connector.js ~ line 108 ~ switchChainID ~ chainId",
    chainId
  );
  try {
    await window.ethereum.on("chainChanged", (chain) => {
      if (Number(chain) !== chainId) {
        switchNetwork(chainId);
        location.reload();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const isMetaMaskConnected = async () => {
  try {
    if (await dAppChecked()) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      return accounts.length > 0;
    }
    return false;
  } catch {
    return false;
  }
};

export const dAppChecked = async () => {
  let status = false;
  if (typeof window.ethereum === "undefined") {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    );
    return status;
  }

  status = true;

  return status;
};

export const smartContact = (
  _contractAddress,
  abi,
  _withJsonRPC = false,
  functionName = undefined,
  rpc = Config.RPC
) => {
  let provider, _provider;

  if (functionName !== undefined) {
    console.log(functionName);
  }

  if (debug) {
    console.log(
      `%c===== SmartContract Connecting to ... [${_contractAddress}] [jsonRPC = ${_withJsonRPC}] =====>`,
      "color: skyblue"
    );
  }

  if (_withJsonRPC === true) {
    _provider = new providers.JsonRpcProvider(rpc);
  } else {
    _provider = web3Provider().getSigner();
  }
  const instantSmartContract = new Contract(_contractAddress, abi, _provider);

  if (debug) {
    console.log(
      `%c===== SmartContract Connected [${_contractAddress}] =====>`,
      "color: skyblue",
      instantSmartContract
    );
  }

  return instantSmartContract;
};

export const getWalletAddress = async () => {
  let wallet;
  /** check DApp is already */
  if (await dAppChecked()) {
    const provider = web3Provider();
    const signer = provider.getSigner();

    wallet = signer.getAddress();
  } /** End check DApp is already */

  return wallet;
};
