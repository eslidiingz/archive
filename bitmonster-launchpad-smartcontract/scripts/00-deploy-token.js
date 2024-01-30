const hre = require("hardhat")

async function main() {
  const DGSToken = await hre.ethers.getContractFactory("DGSToken")
  const Wallet = ""
  const deploy = await DGSToken.deploy(Wallet)

  await deploy.deployed()

  console.log("DGSToken deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/DGSToken.sol:DGSToken",
      constructorArguments: [Wallet],
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
