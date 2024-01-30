// eslint-disable-next-line node/no-unpublished-import
import { deploy } from "../utils/deploy";

async function main() {
  await deploy("Item");
}

main()
  .then(() => {
    throw new Error("Something bad happened!");
  })
  .catch((error) => {
    console.error(error);
    throw new Error("Something bad happened!");
  });
