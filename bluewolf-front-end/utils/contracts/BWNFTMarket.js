import {Contract} from "ethers"
import {parseUnits, formatUnits} from "ethers/lib/utils"
import {abiMarket} from "../../abis"
import Config from "../../utils/config"
import {smartContact, getAccount, dAppChecked} from "../connector/provider"
import Swal from "sweetalert2"

const BwToken = Config.BWC_ADDR
const BwMarketAdd = Config.BWMarket_ADDR
const BwNFT = Config.BWNFT_ADDR

/******************* Read Functions *********************/

export async function getOffer(contractAddress, tokenId) {
  const contract = await smartContact(BwMarketAdd, abiMarket, false)
  const tx = await contract.getOffer(contractAddress, tokenId)
  return tx
}

/******************* Write Functions *********************/

// User call this fn to list an offer for specific item.
export async function makeOffer(tokenId, price, nftContract, endTime) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const _price = await parseUnits(price, 9)
  console.log(tokenId, _price, BwToken, nftContract, endTime)
  const tx = await contract.makeOffer(
    tokenId,
    _price,
    BwToken,
    nftContract,
    endTime
  )
  const status = await tx.wait()

  return status
}

// user cancel fffer for their own
export async function cancelOffer(nftContract, tokenId, offerId) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const tx = await contract.cancelOffer(nftContract, tokenId, offerId)
  const status = await tx.wait()

  return status
}

// Seller accept offer for chosen one.
export async function acceptOffer(
  tokenId,
  offerId,
  tokenContract,
  NFTContract
) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const tx = await contract.acceptOffer(
    tokenId,
    offerId,
    tokenContract,
    NFTContract
  )
  const status = await tx.wait()

  return status
}

/// Seller make order to list on the Marketplace.
export async function createOrder(tokenId, price, NFTAddress) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const _price = await parseUnits(price, 9)
  const tx = await contract.createOrder(NFTAddress, tokenId, _price, BwToken)
  const status = await tx.wait()

  return status
}

//Seller call this function to cancel their listing.
export async function cancelOrder(contractAddress, tokenId) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const tx = await contract.cancelOrder(contractAddress, tokenId)
  const status = await tx.wait()

  return status
}

//Buyer Call this function to buy an item.
export async function Buy(contractAddress, tokenId) {
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
  const contract = await smartContact(BwMarketAdd, abiMarket, true)
  const tx = await contract.Buy(contractAddress, tokenId)
  const status = await tx.wait()

  return status
}

export async function getOrder(contractAddress, tokenId) {
  const contract = await smartContact(BwMarketAdd, abiMarket, false)

  const address = await contract.orders(contractAddress, tokenId)
  return address
}

export async function NFTsLock(contractAddress, tokenId) {
  const contract = await smartContact(BwMarketAdd, abiMarket, false)

  const address = await contract.getLockedNFT(contractAddress, tokenId)
  return address
}
