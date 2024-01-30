const hre = require("hardhat")

async function main() {
  const BLUEWOLFCOIN = await hre.ethers.getContractFactory("BLUEWOLFCOIN")
  const deploy = await BLUEWOLFCOIN.deploy()

  await deploy.deployed()

  console.log("BLUEWOLFCOIN deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/BLUEWOLFCOIN.sol:BLUEWOLFCOIN",
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
