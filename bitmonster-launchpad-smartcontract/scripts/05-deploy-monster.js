const hre = require("hardhat")

async function main() {
  const Ranks = [
    {
      rankId: 1,
      name: "Common",
      price: parseUnits((25).toString()),
      tokenId: [],
    },
    {
      rankId: 2,
      name: "Rare",
      price: parseUnits((60).toString()),
      tokenId: [],
    },
    {
      rankId: 3,
      name: "Epic",
      price: parseUnits((150).toString()),
      tokenId: [],
    },
    {
      rankId: 4,
      name: "Legendary",
      price: parseUnits((250).toString()),
      tokenId: [],
    },
    {
      rankId: 5,
      name: "Immortal",
      price: parseUnits((500).toString()),
      tokenId: [],
    },
  ]

  const monster = await hre.ethers.getContractFactory("DMSMonster")
  const ChainSeedAdd = "0xcadB0bB512DA139C11c73DEc559A14F1092190bd"

  const deploy = await monster.deploy(ChainSeedAdd)

  await deploy.deployed()

  console.log("DMSMonster deployed to:", deploy.address)

  for (const item of Ranks) {
    const _rank = await deploy.setRank(
      item.rankId,
      item.name,
      item.price,
      item.tokenId
    )
    await _rank.wait()
  }

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/DMSMonster.sol:DMSMonster",
      constructorArguments: [ChainSeedAdd],
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
