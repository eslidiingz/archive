import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

console.log("chainId", process.env.CHAIN_ID);
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        97: "https://data-seed-prebsc-1-s2.binance.org:8545/",
        56: "https://bsc-dataseed.binance.org/",
        80001:
          "https://nd-851-869-734.p2pify.com/f403df1ee9cec1bab45a5302e359ba3e",
      },
      chainId: process.env.CHAIN_ID,
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
