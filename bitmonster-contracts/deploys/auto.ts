import { dataLand, dataMonster, dataItem } from "../utils/data";
import {
  deploy,
  upgradeable,
  grantRole,
  MINTER_ROLE,
  LOCKER_ROLE,
  DECREMENT_WHITELIST_ROLE,
  createBoxMonster,
  createBoxLand,
  createBoxItem,
} from "../utils/deploy";

const recipient = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C";
// const tokenBUSD = "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb"; // tbsc
const tokenBUSD = "0x8195fB43c73E577d66f07C55f863C8607b0976A6"; // mumbai

async function main() {
  const contractMonster = await deploy("Monster");
  const contractLand = await deploy("Land");
  const contractItem = await deploy("Item");
  const contractWhitelistToken = await deploy("WhitelistToken", [tokenBUSD]);

  const contractWhitelistMysteryBox = await deploy("WhitelistMysteryBox");
  const contractMysteryBox = await upgradeable("MysteryBoxV1", [
    recipient,
    tokenBUSD,
    contractMonster.address,
    contractLand.address,
    contractItem.address,
    contractWhitelistMysteryBox.address,
  ]);
  const contractBitmonsterMarketplaceV2 = await upgradeable(
    "BitmonsterMarketplaceV2",
    [contractWhitelistToken.address]
  );

  // for mint
  await grantRole(contractMonster, MINTER_ROLE, contractMysteryBox.address);
  await grantRole(contractLand, MINTER_ROLE, contractMysteryBox.address);
  await grantRole(contractItem, MINTER_ROLE, contractMysteryBox.address);

  // for lock
  await grantRole(
    contractMonster,
    LOCKER_ROLE,
    contractBitmonsterMarketplaceV2.address
  );
  await grantRole(
    contractLand,
    LOCKER_ROLE,
    contractBitmonsterMarketplaceV2.address
  );
  await grantRole(
    contractItem,
    LOCKER_ROLE,
    contractBitmonsterMarketplaceV2.address
  );

  // for decrement whitelist
  await grantRole(
    contractWhitelistMysteryBox,
    DECREMENT_WHITELIST_ROLE,
    contractMysteryBox.address
  );
  await grantRole(
    contractWhitelistMysteryBox,
    DECREMENT_WHITELIST_ROLE,
    contractMysteryBox.address
  );
  await grantRole(
    contractWhitelistMysteryBox,
    DECREMENT_WHITELIST_ROLE,
    contractMysteryBox.address
  );

  // add item in gacha
  for (const element of dataMonster) {
    await createBoxMonster(
      contractMysteryBox,
      element.name,
      element.price,
      element.id,
      element.limit,
      element.total
    );
  }

  for (const element of dataLand) {
    await createBoxLand(
      contractMysteryBox,
      element.zone,
      element.price,
      element.id
    );
  }

  for (const element of dataItem) {
    await createBoxItem(
      contractMysteryBox,
      element.box,
      element.price,
      element.key,
      element.id
    );
  }
}

main();
