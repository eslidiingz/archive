const hre = require("hardhat")

async function main() {
  const _name = "BLUEWOLF NFT"
  const _symbol = "BWNFT"

  //Normal
  const BLUEWOLFNFT = await hre.ethers.getContractFactory("BWNFT")
  const deploy = await BLUEWOLFNFT.deploy()
  await deploy.deployed()
  console.log("BWNFT deployed to:", deploy.address)
  const tx = await deploy.initialize(_name, _symbol)
  await tx.wait()

  // //Proxy
  // const BLUEWOLFNFT = await hre.ethers.getContractFactory("BLUEWOLFNFT")
  // const deploy = await hre.upgrades.deployProxy(BLUEWOLFNFT, [_name, _symbol])
  // const tx = await deploy.deployed()
  // console.log("BLUEWOLFNFT deployed to:", deploy.address)

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //     contract: "contracts/BLUEWOLFNFT.sol:BLUEWOLFNFT",
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
