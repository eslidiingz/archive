import {Contract} from "ethers"
import numeral from "numeral"
import {formatEther} from "ethers/lib/utils"
import {abiBwCoin} from "../../abis"
import Config from "../../utils/config"
import {unlimitAmount} from "../lib/utilities"
import Swal from "sweetalert2"
import {getAccount, smartContact, dAppChecked} from "../connector/provider"

const BwToken = Config.BWC_ADDR
const BwMarketAdd = Config.BWMarket_ADDR
const BwNFT = Config.BWNFT_ADDR

export async function getSymbolToken() {
  const contract = await smartContact(BwToken, abiBwCoin, false)

  const symbol = await contract.symbol()
  return symbol
}

export async function getBalanceToken() {
  const owner = await getAccount()
  const contract = await smartContact(BwToken, abiBwCoin, false)
  const balance = formatEther(await contract.balanceOf(owner))

  return numeral(balance).format("0,0.00")
}

export async function approveToken(address) {
  const account = await getAccount()

  if ((await dAppChecked()) === false) {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    )
  }
  if (typeof account === "undefined") {
    Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning")
  }
  const contract = await smartContact(BwToken, abiBwCoin, true)
  const tx = await contract.approve(address, unlimitAmount)
  const status = await tx.wait()

  return status
}

export async function allowanceToken(operator) {
  const contract = await smartContact(BwToken, abiBwCoin, false)
  const owner = await getAccount()
  const allowance = formatEther(await contract.allowance(owner, operator))

  return allowance
}
