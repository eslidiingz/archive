import { Contract } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { abiStake } from "../../abis";
import Config from "../../config";
import { connectProvider } from "../connector/provider";

export async function getPeriodTimeList() {
  const web3Provider = connectProvider();

  const contract = new Contract(Config.STAKE_ADDR, abiStake, web3Provider);
  const allPeriodROI = await contract.getAllPeriodROI();

  return allPeriodROI;
}

export async function calculateReward(amount, day) {
  const web3Provider = connectProvider();
  const contract = new Contract(Config.STAKE_ADDR, abiStake, web3Provider);
  const rewards = await contract.calculateReward(
    parseUnits(amount === "" ? "0" : amount.toString()),
    day
  );

  console.log(rewards);

  return rewards;
}

export async function stakeTokenLaunchpad(amount, period) {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const contract = new Contract(Config.STAKE_ADDR, abiStake, signer);
  const tx = await contract.stake(parseUnits(amount.toString()), period);
  const status = await tx.wait();

  return status;
}

export async function unstakeTokenLaunchpad(stakeId) {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const contract = new Contract(Config.STAKE_ADDR, abiStake, signer);
  const tx = await contract.unstake(stakeId);
  const status = await tx.wait();

  return status;
}

export async function getStakeListByOwner() {
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = signer.getAddress();
  const contract = new Contract(Config.STAKE_ADDR, abiStake, web3Provider);
  const list = await contract.getStakesByOwner(owner);
  return list;
}
