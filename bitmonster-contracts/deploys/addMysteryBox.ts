// eslint-disable-next-line node/no-unpublished-import
import { oldDeploy } from "../utils/deploy";

async function main() {
  const MysteryBoxAddress = "0x0245ee3c835cd87868EfD953e3462A44Bc33b1d3";
  const MysteryBoxV1 = await oldDeploy("MysteryBox", MysteryBoxAddress);
  //   MysteryBoxV1.createMonsterBox(
  //     "Immortal",
  //     BigInt(500000000000000000000).toString(),
  //     [1, 2, 3],
  //     true
  //   );
  MysteryBoxV1.createMonsterBox(
    "Legendary",
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    BigInt(250000000000000000000).toString(),
    [4, 5, 6, 7],
    true
  );
}

main()
  .then((e) => {
    throw new Error("then");
  })
  .catch((error) => {
    // console.error(error);
    throw new Error(error);
  });
