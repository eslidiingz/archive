import numeral from "numeral";
import { Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { connectProvider } from "../connector/provider";
import { unlimitAmount } from "../lib/utilities";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/utilities/toast-display";

export async function getSymbolToken(address) {
  const web3Provider = connectProvider();

  const abis = ["function symbol() public view returns (string)"];
  const contract = new Contract(address, abis, web3Provider);

  const symbol = await contract.symbol();
  return symbol;
}

export async function getBalanceToken(address) {
  const abis = [
    "function balanceOf(address _owner) public view returns (uint256 balance)",
  ];
  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = signer.getAddress();
  const contract = new Contract(address, abis, web3Provider);

  const balance = formatEther(await contract.balanceOf(owner));

  return numeral(balance).format("0,0.00");
}

export async function approveToken(token, operator) {
  const abis = [
    "function approve(address _spender, uint256 _amount) public returns (bool)",
  ];

  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();

  const contract = new Contract(token, abis, signer);

  const tx = await contract.approve(operator, unlimitAmount);
  const status = await tx.wait();

  return status;
}

export async function allowanceToken(token, operator) {
  const abis = [
    "function allowance(address _owner, address _spender) public view returns (uint256)",
  ];

  const web3Provider = connectProvider();
  const signer = web3Provider.getSigner();
  const owner = await signer.getAddress();
  const contract = new Contract(token, abis, web3Provider);

  const allowance = formatEther(await contract.allowance(owner, operator));

  return allowance;
}
