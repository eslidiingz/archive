const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x0245ee3c835cd87868EfD953e3462A44Bc33b1d3";

  // Deploying
  const BitmonsterMarketplace = await ethers.getContractFactory("MysteryBoxV2");
  const upgradeProxy = await upgrades.upgradeProxy(
    proxyAddress,
    BitmonsterMarketplace
  );
  console.log(upgradeProxy);
  await upgradeProxy.deployed();
}

main();
