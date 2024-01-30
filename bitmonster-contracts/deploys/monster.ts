import { ether, hardhat } from "hardhat";

async function main() {
  const contract = await ether.getContractFactory("Monster");
  const contractDeploy = await contract.deploy();

  await contractDeploy.deployed();

  console.log("Contract deployed to:", contractDeploy.address);
  try {
    await hardhat.run("verify:verify", {
      address: contractDeploy.address,
      constructorArguments: [],
    });
  } catch (e: any) {
    console.log("Error", e);
  }
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
