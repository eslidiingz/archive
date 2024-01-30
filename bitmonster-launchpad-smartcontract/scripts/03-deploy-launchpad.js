const {parseEther} = require("ethers/lib/utils")
const hre = require("hardhat")
const {parseUnits} = require("ethers/lib/utils")

async function main() {
  const Package = [
    {
      _packageIndex: 0,
      _totalSupply: 10,
      _packageName: "IMMORTAL PACK",
      _dmsToken: parseUnits((150000).toString()),
      _pairToken: parseUnits((9000).toString()),
    },
    {
      _packageIndex: 1,
      _totalSupply: 20,
      _packageName: "LEGENDARY PACK",
      _dmsToken: parseUnits((100000).toString()),
      _pairToken: parseUnits((4500).toString()),
    },
    {
      _packageIndex: 2,
      _totalSupply: 30,
      _packageName: "EPIC PACK",
      _dmsToken: parseUnits((50000).toString()),
      _pairToken: parseUnits((3000).toString()),
    },
    {
      _packageIndex: 3,
      _totalSupply: 50,
      _packageName: "RARE PACK",
      _dmsToken: parseUnits((25000).toString()),
      _pairToken: parseUnits((1500).toString()),
    },
    {
      _packageIndex: 4,
      _totalSupply: 150,
      _packageName: "COMMON PACK",
      _dmsToken: parseUnits((10000).toString()),
      _pairToken: parseUnits((600).toString()),
    },
    {
      _packageIndex: 5,
      _totalSupply: 450,
      _packageName: "STARTER PACK",
      _dmsToken: parseUnits((5000).toString()),
      _pairToken: parseUnits((300).toString()),
    },
  ]

  const DMSLaunchpad = await hre.ethers.getContractFactory("DMSLaunchpad")
  const DMSToken = ""
  const DMSLocker = ""
  const BUSDToken = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  const Wallet = ""
  const deploy = await DMSLaunchpad.deploy(
    DMSToken,
    DMSLocker,
    BUSDToken,
    Wallet
  )

  await deploy.deployed()

  console.log("DMSLaunchpad deployed to:", deploy.address)

  for (const item of Package) {
    const _package = await deploy.setPackage(
      item._packageIndex,
      item._totalSupply,
      item._packageName,
      item._dmsToken,
      item._pairToken
    )
    await _package.wait()
  }

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //     contract: "contracts/DMSLaunchpad.sol:DMSLaunchpad",
  //     constructorArguments: [DMSToken, DMSLocker, BUSDToken, Wallet],
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
