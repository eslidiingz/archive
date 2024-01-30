// eslint-disable-next-line node/no-unpublished-import
import { deploy, oldDeploy, grantRole, MINTER_ROLE } from "../utils/deploy";

const Monster = "0x16167beC206CC27191d6Ff45011DF2f7d66251Ec";
const Land = "0x195d82094251dF0CB277FF5eA97281627EC64d4f";
const Item = "0x256858895B52a3E60C21eda82555d681FBe191Bb";
async function main() {
  const game = await deploy("Game", [Monster, Land, Item]);
  const monster = await oldDeploy("Monster", Monster);
  const land = await oldDeploy("Land", Land);
  const item = await oldDeploy("Item", Item);
  await grantRole(monster, MINTER_ROLE, game.address);
  await grantRole(land, MINTER_ROLE, game.address);
  await grantRole(item, MINTER_ROLE, game.address);
}

// params maximum 6

main()
  .then(() => {
    throw new Error("Something bad happened!");
  })
  .catch((error) => {
    console.error(error);
    throw new Error("Something bad happened!");
  });
