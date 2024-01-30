const hre = require("hardhat")

async function main() {
  const BWC = await hre.ethers.getContractFactory("BWCoinTest")
  const deploy = await BWC.deploy()

  await deploy.deployed()

  console.log("BWCoinTest deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/BWCoinTest.sol:BWCoinTest",
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
