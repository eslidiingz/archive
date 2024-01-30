const hre = require("hardhat");

async function main() {
  const name = "Eplus";
  const symbol = "EPLUS";

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(name, symbol);

  await token.deployed();

  console.log("Token deployed to:", token.address);

  try {
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [name, symbol],
    });
  } catch (e) {}
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
