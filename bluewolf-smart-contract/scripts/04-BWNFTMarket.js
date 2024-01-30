const hre = require("hardhat")
const dayjs = require("dayjs")
const duration = require("dayjs/plugin/duration")

dayjs.extend(duration)

const convertTime = (amount, unit) => {
  return dayjs.duration(amount, unit).asSeconds()
}

async function main() {
  const BLUEWOLFNFTMarket = await hre.ethers.getContractFactory("BWMarket")
  const recipientWallet = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C"
  const fee = 300

  const deploy = await BLUEWOLFNFTMarket.deploy(recipientWallet, fee)
  await deploy.deployed()

  console.log("BWMarket deployed to:", deploy.address)

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //     contract: "contracts/BLUEWOLFNFTMarket.sol:BLUEWOLFNFTMarket",
  //     constructorArguments: [recipientWallet, fee],
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
