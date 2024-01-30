import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org",
      },
      chainId: 56,
    },
  },
};

export function modalConnect() {
  // if (typeof window.ethereum === "undefined") return null
  return new Web3Modal({
    cacheProvider: true,
  });
}

export function connectProvider() {
  if (typeof window.ethereum === "undefined") return null;
  return new providers.Web3Provider(window.ethereum);
}
