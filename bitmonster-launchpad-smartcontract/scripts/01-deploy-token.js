const hre = require("hardhat")

async function main() {
  const DMSToken = await hre.ethers.getContractFactory("DMSToken")
  const Wallet = ""
  const deploy = await DMSToken.deploy(Wallet)

  await deploy.deployed()

  console.log("DMSToken deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/DMSToken.sol:DMSToken",
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
