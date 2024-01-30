// const { ethers, upgrades } = require("hardhat");
import {
  deploy,
  upgradeable,
  oldDeploy,
  grantRole,
  MINTER_ROLE,
  DECREMENT_WHITELIST_ROLE,
  createBoxMonster,
  createBoxLand,
  createBoxItem,
} from "../utils/deploy";

async function main() {
  const recipient = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C";
  const tokenBUSD = "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb";

  const monster = "0x9D1ecD7187a5177D51fD1457fe1Bd9D3A98e65c1";
  const land = "0x57b243609cd735A7831a6207d4A1e63Cb7817dD3";
  const item = "0x8673c5FF48AE00a2f3926b4BD558Fa7a77240679";

  const contractWhitelistMysteryBox = await deploy("WhitelistMysteryBox");
  const contractMysteryBox = await upgradeable("MysteryBoxV1", [
    recipient,
    tokenBUSD,
    monster,
    land,
    item,
    contractWhitelistMysteryBox.address,
  ]);

  const contractMonster = await oldDeploy("Monster", monster);
  const contractLand = await oldDeploy("Land", land);
  const contractItem = await oldDeploy("Item", item);

  // for mint
  await grantRole(contractMonster, MINTER_ROLE, contractMysteryBox.address);
  await grantRole(contractLand, MINTER_ROLE, contractMysteryBox.address);
  await grantRole(contractItem, MINTER_ROLE, contractMysteryBox.address);

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
  const dataMonster = [
    {
      name: "Immortal",
      price: 500000000000000000000,
      id: [1, 2, 3],
      limit: [200, 200, 200],
      total: 600,
    },
    {
      name: "Legendary",
      price: 250000000000000000000,
      id: [4, 5, 6, 7],
      limit: [200, 200, 200, 200],
      total: 800,
    },
    {
      name: "Epic",
      price: 150000000000000000000,
      id: [8, 9, 10, 11, 12, 13],
      limit: [167, 167, 167, 167, 166, 166],
      total: 1000,
    },
    {
      name: "Rare",
      price: 60000000000000000000,
      id: [14, 15, 16, 17, 18, 19, 20],
      limit: [215, 215, 214, 214, 214, 214, 214],
      total: 1500,
    },
    {
      name: "Common",
      price: 25000000000000000000,
      id: [21, 22, 23, 24, 25],
      limit: [600, 600, 600, 600, 600],
      total: 3000,
    },
  ];
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
  const dataLandId = [
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
    116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
    131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145,
    146, 147, 148, 149, 150, 151, 152, 201, 202, 203, 204, 205, 206, 207, 208,
    209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
    224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238,
    239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 301,
    302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316,
    317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331,
    332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346,
    347, 348, 349, 350, 351, 352, 401, 402, 403, 404, 405, 406, 407, 408, 409,
    410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424,
    425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439,
    440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 501, 502,
    503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517,
    518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532,
  ];
  const dataLandPrice = 25000000000000000000;
  const dataLand = [
    {
      zone: 1,
      price: dataLandPrice,
      id: dataLandId,
    },
    {
      zone: 2,
      price: dataLandPrice,
      id: dataLandId,
    },
    {
      zone: 3,
      price: dataLandPrice,
      id: dataLandId,
    },
    {
      zone: 4,
      price: dataLandPrice,
      id: dataLandId,
    },
    {
      zone: 5,
      price: dataLandPrice,
      id: dataLandId,
    },
  ];
  for (const element of dataLand) {
    await createBoxLand(
      contractMysteryBox,
      element.zone,
      element.price,
      element.id
    );
  }

  const dataItem = [
    {
      box: 1,
      price: 25000000000000000000,
      key: [40, 70, 85, 95, 100],
      id: {
        "40": [
          1, 4, 5, 6, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 21, 24, 25, 26, 28,
          29, 30, 31,
        ],
        "70": [2, 9, 20, 23, 33, 43, 44, 45, 46, 47, 48, 49, 50],
        "85": [3, 22, 27, 32, 34, 41],
        "95": [12, 13, 36, 42],
        "100": [35, 37, 38, 39, 40],
      },
    },
  ];
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
