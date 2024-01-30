import { Contract } from "ethers";
import { abiLocker } from "../../abis";
import Config from "../../config";
import { connectProvider } from "../connector/provider";

export async function getSaleTypeList() {
  const web3Provider = connectProvider();

  const contract = new Contract(Config.LOCKER_ADDR, abiLocker, web3Provider);
  const saleType = await contract.getSaleTypeList();

  return saleType;
}

export async function getLengthTokenLock() {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = await signer.getAddress();
  const contract = new Contract(Config.LOCKER_ADDR, abiLocker, web3Provider);
  const lengthToken = await contract.getLockersByOwner(owner);

  return lengthToken.length;
}

export async function getTokenLockByOwner(index) {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = await signer.getAddress();

  const contract = new Contract(Config.LOCKER_ADDR, abiLocker, web3Provider);

  const tokenLock = await contract.getTokenLockByIndex(owner, index);

  return tokenLock;
}

export async function unlockTokenByOwner(index, expiration) {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = await signer.getAddress();

  const contract = new Contract(Config.LOCKER_ADDR, abiLocker, signer);

  const tx = await contract.unlock(owner, index, expiration);
  const status = await tx.wait();
  return status;
}
