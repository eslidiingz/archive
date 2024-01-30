import { ethers } from "ethers";
import { useState } from "react";

export const ConnectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const walletAddress = await provider.send("eth_requestAccounts", []);
  console.log(walletAddress);
  const signer = provider.getSigner();
  return signer._isSigner;
};

export const isConnected = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return signer._isSigner;
};

export const GetWalletAddress = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  var wallet;

  if (typeof window.ethereum !== "undefined") {
    const _wallet = await provider.send("eth_requestAccounts", []);
    wallet = _wallet[0];
  }

  return wallet;
};
export const GetShortAddress = (walletAddress) => {
  if(!walletAddress) return "None";
  // if(!isSignIn) return false;
  let prefix = walletAddress;
  let subfix = walletAddress;
  prefix = prefix.slice(0, 6);
  subfix = subfix.slice(subfix.length - 4);
  return prefix + "..." + subfix;
};
