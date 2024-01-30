const hre = require("hardhat")

async function main() {
  const ChainSeed = await hre.ethers.getContractFactory("ChainSeed")
  const provider = [
    "0x298619601ebCd58d0b526963Deb2365B485Edc74",
    "0x5e66a1775BbC249b5D51C13d29245522582E671C",
    "0xbe75E0725922D78769e3abF0bcb560d1E2675d5d",
    "0x887f177CBED2cf555a64e7bF125E1825EB69dB82",
    "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
    "0x1a602D4928faF0A153A520f58B332f9CAFF320f7",
    "0x5741306c21795FdCBb9b265Ea0255F499DFe515C",
    "0x5ea7D6A33D3655F661C298ac8086708148883c34",
    "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
    "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C",
    "0xB8eADfD8B78aDA4F85680eD96e0f50e1B5762b0a",
    "0x0630521aC362bc7A19a4eE44b57cE72Ea34AD01c",
    "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
    "0x2939E0089e61C5c9493C2013139885444c73a398",
    "0x963D5e7f285Cc84ed566C486c3c1bC911291be38",
    "0xEA8731FD0685DB8AeAde9EcAE90C4fdf1d8164ed",
    "0x6C2441920404835155f33d88faf0545B895871b1",
    "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
    "0x17308A18d4a50377A4E1C37baaD424360025C74D",
  ]

  const deploy = await ChainSeed.deploy(provider)

  await deploy.deployed()

  console.log("ChainSeed deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/ChainSeed.sol:ChainSeed",
      constructorArguments: [provider],
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
