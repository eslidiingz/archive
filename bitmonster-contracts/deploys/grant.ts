// eslint-disable-next-line node/no-unpublished-import
import {
  oldDeploy,
  grantRole,
  MINTER_ROLE,
  LOCKER_ROLE,
} from "../utils/deploy";

async function main() {
  const Monster = "0x04c95876ddf108B7535E1358f0B1DeFF0094a7fB";
  const Land = "0x438a0f4F8109600226711B72Fb1058D10a63c579";
  const Item = "0x03561064b4EE4b4852925F18a0c64ac1649EA6B7";
  const MysteryBox = "0x19d85e1C508864087f97b40C60d51441C50b8598";
  const Marketplace = "0x27d73567A62189aEc96e0b7311EF68434D3b283F";
  const monster = await oldDeploy("Monster", Monster);
  const land = await oldDeploy("Land", Land);
  const item = await oldDeploy("Item", Item);
  await grantRole(monster, MINTER_ROLE, MysteryBox);
  await grantRole(land, MINTER_ROLE, MysteryBox);
  await grantRole(item, MINTER_ROLE, MysteryBox);
  await grantRole(monster, LOCKER_ROLE, Marketplace);
  await grantRole(land, LOCKER_ROLE, Marketplace);
  await grantRole(item, LOCKER_ROLE, Marketplace);
}

main()
  .then(() => {
    throw new Error("Something bad happened!");
  })
  .catch((error) => {
    console.error(error);
    throw new Error("Something bad happened!");
  });
