import { Contract } from "ethers";
import { abiBwNft } from "../../abis";
import Config from "../../utils/config";
import { smartContact, getAccount, dAppChecked } from "../connector/provider";
import Swal from "sweetalert2";
import { adminWalletList } from "utils/global-variables";

const BwToken = Config.BWC_ADDR;
const BwMarketAdd = Config.BWMarket_ADDR;
const BwNFT = Config.BWNFT_ADDR;

/******************* Read FunctionsfIsAdmin *********************/

export async function tokenURI(tokenId) {
  const contract = smartContact(BwNFT, abiBwNft, false);
  const getTokenURI = await contract.tokenURI(tokenId);

  return getTokenURI;
}

/******************* Write Functions *********************/

// User call this function to approve token.
export async function approve(address, tokenId) {
  const account = await getAccount();
  if ((await dAppChecked()) === false) {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    );
  }
  if (typeof account === "undefined") {
    Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning");
  }
  const contract = await smartContact(BwNFT, abiBwNft, true);
  const tx = await contract.approve(address, tokenId);
  const status = await tx.wait();
  return status;
}

// User call this function to mint their NFT.
export async function safeMint(hash) {
  const owner = await getAccount();
  if ((await dAppChecked()) === false) {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    );
  }
  if (typeof owner === "undefined") {
    Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning");
  }
  const contract = await smartContact(BwNFT, abiBwNft, true);
  const tokenId = await contract.safeMint(hash);
  const status = await tokenId.wait();

  return tokenId;
}

// Admin call this function to grant role for users.
export async function grantRole(roleBytes, address) {
  const owner = await getAccount();
  if ((await dAppChecked()) === false) {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    );
  }
  if (typeof owner === "undefined") {
    Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning");
  }
  const contract = await smartContact(BwNFT, abiBwNft, true);
  const tx = await contract.grantRole(roleBytes, address);
  const status = await tx.wait();

  return status;
}

export async function getLatestTokenId(owner) {
  const contract = await smartContact(BwNFT, abiBwNft, false);

  const totalNFTs = await contract.balanceOf(owner);
  const tokenId = await contract.tokenOfOwnerByIndex(owner, totalNFTs - 1);
  return tokenId;
}

export async function getNFTApproved(owner, operator) {
  const contract = await smartContact(BwNFT, abiBwNft, false);
  const approved = await contract.isApprovedForAll(owner, operator);
  return approved;
}

export async function getNFTs(tokenId) {
  const contract = await smartContact(BwNFT, abiBwNft, false);
  const address = await contract.sNfts(tokenId);
  return address;
}

export async function IsAdmin(_address) {
  let status = false;
  let _isAdmin = adminWalletList.find((_w) => _w == _address);

  if (
    typeof _isAdmin !== "undefined" &&
    _isAdmin.toLocaleLowerCase() === _address.toLocaleLowerCase()
  )
    status = true;

  return status;

  // const contract = await smartContact(BwNFT, abiBwNft, false)
  // const address = await contract.hasRole(Config.ADMIN_ROLE, _address)
  // return address
}

export async function approvedForAll(operator) {
  const account = await getAccount();
  if ((await dAppChecked()) === false) {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp",
      "warning"
    );
  }
  if (typeof account === "undefined") {
    Swal.fire("Warning", "Please, Connect metamark to the DApp", "warning");
  }
  const contract = await smartContact(BwNFT, abiBwNft, true);
  const tx = await contract.setApprovalForAll(operator, true);
  const status = await tx.wait();

  return status;
}

export async function getNFTsByAddress(owner) {
  const contract = await smartContact(BwNFT, abiBwNft, false);
  const total = await contract.balanceOf(owner);
  let tokenId = [];
  for (let i = 0; i < total.toNumber(); i++) {
    const _tokenId = await contract.tokenOfOwnerByIndex(owner, i);
    tokenId.push(_tokenId.toNumber());
  }
  return tokenId;
}
