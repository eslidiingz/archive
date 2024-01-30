// eslint-disable-next-line node/no-unpublished-import
import { deploy, oldDeploy, grantRole, MINTER_ROLE } from "../utils/deploy";
import { address } from "../utils/CA";
const version = "mumbai";
const amountToken = BigInt(10 ** 7 * 10 ** 18).toString();

async function main() {
  const monster = await oldDeploy("Monster", address[version].monster);
  const land = await oldDeploy("Land", address[version].land);
  const item = await oldDeploy("Item", address[version].item);
  const DMS = await deploy("TokenMock", [
    "DRAGON MOON STONE",
    "DMS",
    amountToken,
  ]);
  const DGS = await deploy("TokenMock", [
    "DRAGON GOLD STONE",
    "DGS",
    amountToken,
  ]);

  const gameContract = await deploy("Game", [
    address[version].monster,
    address[version].land,
    address[version].item,
    DMS.address,
    DGS.address,
  ]);

  // const gameContract = await oldDeploy("Game", address[version].game);

  // const transferDMS = await DMS.transfer(gameContract.address, amountToken);
  // await transferDMS.wait();

  // const transferDGS = await DGS.transfer(gameContract.address, amountToken);
  // await transferDGS.wait();

  await grantRole(monster, MINTER_ROLE, gameContract.address);
  await grantRole(land, MINTER_ROLE, gameContract.address);
  await grantRole(item, MINTER_ROLE, gameContract.address);
}

main()
  .then(() => {
    throw new Error("Something bad happened!");
  })
  .catch((error) => {
    console.error(error);
    throw new Error("Something bad happened!");
  });
