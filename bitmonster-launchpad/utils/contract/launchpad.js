import {Contract} from "ethers"

import {connectProvider} from "../connector/provider"
import Config from "../../config"
import {abiLaunchpad} from "../../abis"
import {formatUnits, parseUnits} from "ethers/lib/utils"

export async function getRateLaunchpad() {
  const web3Provider = connectProvider()

  const contract = new Contract(
    Config.LAUNCHPAD_ADDR,
    abiLaunchpad,
    web3Provider
  )

  const tokenRate = await contract.getTokenRate(Config.BUSD_ADDR)

  const _tokenRate = await formatUnits(tokenRate.rate, "wei")

  return _tokenRate
}

export async function buyPackage(type, packgage) {
  const web3Provider = connectProvider()
  const signer = web3Provider.getSigner()

  const contract = new Contract(Config.LAUNCHPAD_ADDR, abiLaunchpad, signer)

  const tx = await contract.buy(Config.BUSD_ADDR, type, packgage)
  const status = await tx.wait()
  return status
}

export async function getPackageindex() {
  const web3Provider = connectProvider()
  const signer = web3Provider.getSigner()
  const contract = new Contract(Config.LAUNCHPAD_ADDR, abiLaunchpad, signer)
  const packageIndex = await contract.getPackageIndex()

  return packageIndex
}

export async function getPackages(index) {
  const web3Provider = connectProvider()
  const signer = web3Provider.getSigner()
  const contract = new Contract(Config.LAUNCHPAD_ADDR, abiLaunchpad, signer)
  const _package = await contract.getPackage(index)

  return _package
}

export async function sellLaunchpad(amount) {
  const web3Provider = connectProvider()
  const signer = web3Provider.getSigner()
  const contract = new Contract(Config.LAUNCHPAD_ADDR, abiLaunchpad, signer)
  const tx = await contract.sell(parseUnits(amount), Config.BUSD_ADDR)
  const status = await tx.wait()

  return status
}
