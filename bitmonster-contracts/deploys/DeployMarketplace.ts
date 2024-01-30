const { ethers, upgrades } = require("hardhat");

async function main() {
    const whitelist = "0x26DD6f467692e84467588a88bff7E63C583167F0";

    // Deploying
    const BitmonsterMarketplaceV1 = await ethers.getContractFactory("BitmonsterMarketplaceV1");
    const instance = await upgrades.deployProxy(
        BitmonsterMarketplaceV1,
        [whitelist],
        {
            initializer: "initialize",
        }
    );

    await instance.deployed();
    console.log(instance.address);
}

main();