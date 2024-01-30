const hre = require("hardhat")
const dayjs = require("dayjs")
const duration = require("dayjs/plugin/duration")

dayjs.extend(duration)

const convertTime = (amount, unit) => {
  return dayjs.duration(amount, unit).asSeconds()
}

async function main() {
  const saleType = [
    {
      name: "Seed",
      timeLock: [
        convertTime(5, "minutes"),
        convertTime(10, "minutes"),
        convertTime(30, "minutes"),
        convertTime(1, "hours"),
        convertTime(2, "hours"),
      ],
      percentLock: [10, 20, 30, 20, 20],
    },
    {
      name: "Public Sale",
      timeLock: [
        convertTime(5, "minutes"),
        convertTime(10, "minutes"),
        convertTime(30, "minutes"),
      ],
      percentLock: [30, 30, 40],
    },
    {
      name: "Private Sale",
      timeLock: [
        convertTime(6, "months"),
        convertTime(7, "months"),
        convertTime(8, "months"),
        convertTime(9, "months"),
        convertTime(10, "months"),
        convertTime(11, "months"),
        convertTime(12, "months"),
      ],
      percentLock: [20, 15, 15, 15, 15, 15, 5],
    },
  ]

  const DMSLocker = await hre.ethers.getContractFactory("DMSLocker")
  const DMSToken = ""
  const deploy = await DMSLocker.deploy(DMSToken)

  await deploy.deployed()

  console.log("DMSLocker deployed to:", deploy.address)

  for (const item of saleType) {
    const _saleType = await deploy.setSaleType(
      item.name,
      item.timeLock,
      item.percentLock
    )

    await _saleType.wait()
  }

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //     contract: "contracts/DMSLocker.sol:DMSLocker",
  //     constructorArguments: [DMSToken],
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
