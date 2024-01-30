import hre from "hardhat";
import { url } from "inspector";

export const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
export const LOCKER_ROLE =
  "0xaf9a8bb3cbd6b84fbccefa71ff73e26e798553c6914585a84886212a46a90279";
export const DECREMENT_WHITELIST_ROLE =
  "0xb25a8f1c660f8b6e3b36ea8f4367324d56b6af9776c2a44564ae8df1b4d56208";
export const CREATE_WHITELIST_ROLE =
  "0x8ef86fad7d1f928a3294c0d6bc10cfae9863271c28df9cdabe172f1502d1fcdb";
export async function deploy(_contract: string, params: Array<string> = []) {
  const urlDeploy = await hre.ethers.getDefaultProvider().getNetwork();
  // console.log(urlDeploy)

  const contract = await hre.ethers.getContractFactory(_contract);
  let deploy: any;
  if (params.length > 0) {
    if (params.length <= 1) {
      deploy = await contract.deploy(params[0]);
    } else if (params.length <= 2) {
      deploy = await contract.deploy(params[0], params[1]);
    } else if (params.length <= 3) {
      deploy = await contract.deploy(params[0], params[1], params[2]);
    } else if (params.length <= 4) {
      deploy = await contract.deploy(
        params[0],
        params[1],
        params[2],
        params[3]
      );
    } else if (params.length <= 5) {
      deploy = await contract.deploy(
        params[0],
        params[1],
        params[2],
        params[3],
        params[4]
      );
    } else if (params.length <= 6) {
      deploy = await contract.deploy(
        params[0],
        params[1],
        params[2],
        params[3],
        params[4],
        params[5]
      );
    }
  } else {
    deploy = await contract.deploy();
  }
  console.log("\u001b[1;31m ================= \u001b[1;0m");
  console.log(_contract + " Contract deployed to:", deploy.address);
  console.log("\u001b[1;31m ================= \u001b[1;0m");
  console.log("\n");

  await deploy.deployed();

  setTimeout(() => {
    verify(deploy.address, params);
  }, 10000);
  // if (urlDeploy !== "http://localhost:8545") {

  // }
  return deploy;
}
export async function upgradeable(
  _contract: string,
  params: Array<string> = []
) {
  const contract = await hre.ethers.getContractFactory(_contract);
  const instance = await hre.upgrades.deployProxy(contract, params, {
    initializer: "initialize",
  });

  await instance.deployed();
  console.log("\u001b[1;31m ================= \u001b[1;0m");
  console.log(_contract + " Contract deployed proxy to:", instance.address);
  console.log("\u001b[1;31m ================= \u001b[1;0m");
  console.log("\n");
  return instance;
}
export async function oldDeploy(_contract: string, address: string) {
  const contract = await hre.ethers.getContractFactory(_contract);
  const deploy = await contract.attach(address);
  return deploy;
}
export async function verify(_address: string, _params: Array<string>) {
  console.log("\u001b[1;34m ================= \u001b[1;0m");
  console.log("_address", typeof _address);
  console.log("_params", Array.isArray(_params));
  try {
    await hre.run("verify:verify", {
      address: _address,
      constructorArguments: _params,
    });
  } catch (e: any) {
    console.log(_address + " verify error");
    console.log(e);
  }
  console.log("\u001b[1;34m ================= \u001b[1;0m");
  console.log("\n");
}
export async function grantRole(_contract: any, _role: any, _to: string) {
  console.log("\u001b[1;34m ================= \u001b[1;0m");

  const result: any = await _contract.grantRole(_role, _to);
  const status = await result.wait();
  // console.log(_contract + " grantRole :", status + " | hash :" + result.hash);
  console.log("grantRole transactionHash: " + status.transactionHash);
  console.log("\u001b[1;34m ================= \u001b[1;0m");
  console.log("\n");
}

export async function createBoxMonster(
  _contract: any,
  _name: string,
  _price: number,
  _id: Array<number>,
  _limit: Array<number>,
  _total: number
) {
  const create = await _contract.createMonsterBox(
    _name,
    BigInt(_price).toString(),
    _id,
    _limit,
    _total,
    true
  );
  const result = await create.wait();
  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log(
    "Create Monster [" + _name + "] transactionHash",
    result.transactionHash
  );
  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log("\n");
}
export async function createBoxLand(
  _contract: any,
  _zone: number,
  _price: number,
  _id: Array<number>
) {
  const create = await _contract.createLandBox(
    _zone,
    BigInt(_price).toString(),
    _id,
    true
  );
  const result = await create.wait();

  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log(
    "Create Land [" + _zone + "] transactionHash",
    result.transactionHash
  );
  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log("\n");
}
export async function createBoxItem(
  _contract: any,
  _box: number,
  _price: number,
  _key: Array<number>,
  _id: any
) {
  console.log("_key", _key);
  console.log("_id", _id);
  const create = await _contract.createItemBox(
    _box,
    BigInt(_price).toString(),
    _key
  );
  const result = await create.wait();
  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log(
    "Create Item [" + _box + "] transactionHash",
    result.transactionHash
  );
  console.log("\u001b[1;35m ================= \u001b[1;0m");
  console.log("\n");

  for (const element of _key) {
    console.log("_id[element]", _id[element]);
    const insertItemInBox = await _contract.updateItemIdInBox(
      _box,
      element,
      _id[element]
    );
    const resultInsertItemInBox = await insertItemInBox.wait();
    console.log("\u001b[1;36m ================= \u001b[1;0m");
    console.log(
      "Set Item [" + _box + "][" + element + "] transactionHash",
      resultInsertItemInBox.transactionHash
    );
    console.log("\u001b[1;36m ================= \u001b[1;0m");
    console.log("\n");
  }

  const openBox = await _contract.updateIsOpenItemBox(_box, true);
  const resultOpenBox = await openBox.wait();
  console.log("\u001b[1;36m ================= \u001b[1;0m");
  console.log(
    "Open Item [" + _box + "] transactionHash",
    resultOpenBox.transactionHash
  );
  console.log("\u001b[1;36m ================= \u001b[1;0m");
  console.log("\n");
}
