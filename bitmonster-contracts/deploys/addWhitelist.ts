// eslint-disable-next-line node/no-unpublished-import
import { oldDeploy, CREATE_WHITELIST_ROLE } from "../utils/deploy";
import { address } from "../utils/CA";
const version = "demo2";

async function main() {
  const wallet = "0xA28643FB862C59Ed815DCF576Ec51Bf2bdcf3D11";
  const contract = await oldDeploy(
    "WhitelistMysteryBox",
    address[version].WhitelistMysteryBox
  );
  await contract.grantRoleAdd(wallet);
  const check = await contract.hasRole(CREATE_WHITELIST_ROLE, wallet);
  console.log("check", check);
}

main()
  .then(() => {
    throw new Error("Something bad happened!");
  })
  .catch((error) => {
    console.error(error);
    throw new Error("Something bad happened!");
  });
