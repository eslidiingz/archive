// plugins
const config = require("../configs/app");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");
const ethers = require("ethers");

// model
const Farm = require("../models/Farm");
const UserLand = require("../models/UserLand");
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const Pool = require("../models/Pool");
const StakeLog = require("../models/StakeLog");
const Mint = require("../models/Mint");

// service
const serviceInventory = require("../services/inventory.service");
const serviceStack = require("../services/stakelog.service");
const serviceClaim = require("../services/claim.service");

// other
const utils = require("../helpers/utils");

// config
const { useProviderUrl } = require("../helpers/utils");
const CONTRACT_GAME = process.env.CONTRACT_GAME;
const ABI_GAME = require("../abi/Game.json");
const debug_mint = process.env.DEBUG_MINT || false;
const mintMonsterWithGame =
  "mintMonsterWithGame(uint256 monsterId, uint256 nonce, bytes memory signature)";
const mintLandWithGame =
  "mintLandWithGame(uint256 landId, uint256 nonce, bytes memory signature)";
const mintItemWithGame =
  "mintItemWithGame(uint256 token, uint256 amount, uint256 nonce, bytes memory signature)";
const mintTokenDMSWithGame =
  "mintTokenDMSWithGame(uint256 amount, uint256 nonce, bytes memory signature)";
const mintTokenDGSWithGame =
  "mintTokenDGSWithGame(uint256 amount, uint256 nonce, bytes memory signature)";

// methods
const methods = {
  sign(contract, typeHash, operator, nonce, arg = null) {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    const types = [
      "address",
      "bytes32",
      "address",
      arg === null ? "string" : typeof arg === "string" ? "string" : "uint256",
      "uint256",
    ];
    const values = [
      contract,
      typeHash,
      operator,
      arg === null ? "" : arg.toString(),
      nonce,
    ];
    const keccak256 = ethers.utils.solidityKeccak256(types, values);
    return signer.signMessage(ethers.utils.arrayify(keccak256));
  },
  signTwoArg(contract, typeHash, operator, nonce, arg1 = null, arg2 = null) {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    const types = [
      "address",
      "bytes32",
      "address",
      arg1 === null
        ? "string"
        : typeof arg1 === "string"
        ? "string"
        : "uint256",
      arg2 === null
        ? "string"
        : typeof arg2 === "string"
        ? "string"
        : "uint256",
      "uint256",
    ];
    const values = [
      contract,
      typeHash,
      operator,
      arg1 === null ? "" : arg1.toString(),
      arg2 === null ? "" : arg2.toString(),
      nonce,
    ];
    const keccak256 = ethers.utils.solidityKeccak256(types, values);
    return signer.signMessage(ethers.utils.arrayify(keccak256));
  },
  getSequenceNonce(userWallet) {
    let customHttpProvider = new ethers.providers.JsonRpcProvider(
      useProviderUrl
    );
    return new Promise(async (resolve, reject) => {
      try {
        const signer = new ethers.Wallet(
          process.env.PRIVATE_KEY,
          customHttpProvider
        );
        const contract = await new ethers.Contract(
          CONTRACT_GAME,
          ABI_GAME,
          signer
        );
        const result = await contract.getSequenceNonce(userWallet);
        if (parseInt(result._hex, 16) >= 0) {
          resolve(parseInt(result._hex, 16));
        } else {
          reject(ErrorNotFound("Nonce error!!"));
        }
        // const contract = new ethers.Contract(contract_game, this.abi_game, this.provider.getSigner());
      } catch (error) {
        reject(error);
      }
    });
  },

  // monster
  sigMonster(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const monsterFind = await Farm.findOne({
          walletAddress: userWallet,
          "monsters._id": req.body.farmId,
        }).populate("monsters.monsterId");
        if (monsterFind) {
          let monsterFilter = monsterFind.monsters.filter((element) => {
            if (!element.status.default && req.body.farmId == element._id) {
              return element;
            }
          })[0];

          // remove data in farm
          await Farm.updateOne(
            { _id: monsterFind.id, walletAddress: userWallet },
            {
              $pull: {
                monsters: { _id: monsterFilter._id },
              },
            }
          );

          // move data to collection mint
          const mintMonster = new Mint({
            walletAddress: userWallet,
            data: monsterFilter,
          });
          const resultMintMonster = await mintMonster.save();

          // config for mint nft and signature
          const monsterId = parseInt(
            monsterFilter.monsterId.no.replace("Mon", "")
          );
          const typHash = ethers.utils.id(mintMonsterWithGame);
          const nonce = await methods.getSequenceNonce(userWallet);
          const signature = await methods.sign(
            CONTRACT_GAME,
            typHash,
            userWallet,
            nonce,
            monsterId
          );
          resolve({
            signature: signature,
            nonce: nonce,
            monsterId,
            mint: resultMintMonster._id,
          });
        } else {
          reject(ErrorNotFound("Monster not found"));
        }
        reject(ErrorNotFound("Monster not found"));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateSigMonster(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let body = {};
        body.hash = req.body.status == "wait" ? req.body.hash : "";
        body.status = req.body.status;
        let find = {
          _id: req.body.id,
          walletAddress: userWallet,
        };
        const dataMonster = await Mint.findOne(find);
        if (
          (dataMonster.status == "create" || dataMonster.status == "wait") &&
          (req.body.status == "wait" || req.body.status == "cancel")
        ) {
          const monsterUpdate = await Mint.findOneAndUpdate(find, body);

          if (req.body.status == "cancel") {
            // remove object id for new id
            delete dataMonster.data._id;

            // push data
            const reverseMonster = await Farm.updateOne(
              { walletAddress: userWallet },
              {
                $push: {
                  monsters: dataMonster.data,
                },
              }
            );
            resolve(monsterUpdate);
          } else {
            resolve(monsterUpdate);
          }
        } else {
          reject(ErrorNotFound("status is wrong!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  confirmSigMonster(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const mintUpdate = await Mint.findOneAndUpdate(
          { _id: req.body.id, walletAddress: userWallet },
          {
            status: "close",
          }
        );
        resolve(mintUpdate);
      } catch (error) {
        reject(error);
      }
    });
  },

  // land
  sigLand(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const landFind = await UserLand.findOne({
          walletAddress: userWallet,
          _id: req.body.userLandId,
          active: false,
        });
        if (landFind) {
          if (landFind.assets.length == 0 || landFind.monsters.length == 0) {
            // delete land in userLand
            const landUpdate = await UserLand.deleteOne({
              walletAddress: userWallet,
              _id: req.body.userLandId,
            });

            // move data to collection mint
            const mintLand = new Mint({
              walletAddress: userWallet,
              data: landFind,
            });
            const resultMintLand = await mintLand.save();

            const typHash = ethers.utils.id(mintLandWithGame);
            const userLandId = parseInt(
              landFind.zone.toString() +
                landFind.landCode._id.slice(-1) +
                ("000" + landFind.index).slice(-2)
            );
            const nonce = await methods.getSequenceNonce(userWallet);
            const signature = await methods.sign(
              CONTRACT_GAME,
              typHash,
              userWallet,
              nonce,
              userLandId
            );
            resolve({
              signature: signature,
              nonce: nonce,
              userLandId,
              mint: resultMintLand._id,
            });
          } else {
            reject(ErrorNotFound("Land have monster or asset!!"));
          }
        } else {
          reject(ErrorNotFound("Land not found"));
        }
        reject(ErrorNotFound("Land not found"));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateSigLand(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let body = {};
        body.hash = req.body.status == "wait" ? req.body.hash : "";
        body.status = req.body.status;
        let find = {
          _id: req.body.id,
          walletAddress: userWallet,
        };

        const dataLand = await Mint.findOne(find);
        if (
          (dataLand.status == "create" || dataLand.status == "wait") &&
          (req.body.status == "wait" || req.body.status == "cancel")
        ) {
          const landData = await Mint.findOneAndUpdate(find, body);

          if (req.body.status == "cancel") {
            // remove object id for new id
            delete dataLand.data._id;

            // push data
            const reverseLand = new UserLand(dataLand.data);
            const insertLand = reverseLand.save();
            resolve(insertLand);
          } else {
            resolve(landData);
          }
        } else {
          reject(ErrorNotFound("status is wrong!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  confirmSigLand(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataFind = { _id: req.body.id, walletAddress: userWallet };
        const find = await Mint.findOne(dataFind);
        if (find.status == "wait") {
          const tokenUpdate = await Mint.findOneAndUpdate(dataFind, {
            status: "close",
          });
          resolve(tokenUpdate);
        } else {
          reject(ErrorNotFound("Status is wrong"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  //item
  sigItem(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("req.body.itemId", req.body.itemId);
        let itemFind = await Inventory.findOne({
          walletAddress: userWallet,
          "assets.assetId": req.body.itemId,
        }).populate("assets.assetId");
        if (itemFind) {
          let status = false;
          for (const dataAsset of itemFind.assets) {
            if (req.body.itemId == dataAsset.assetId._id) {
              console.log(dataAsset.assetId._id);
              for (const stackData of dataAsset.amount) {
                if (!stackData.default) {
                  const totalAmount = await utils.convertArrayToNumber(
                    stackData.stack
                  );
                  if (req.body.amount > 0 && req.body.amount <= totalAmount) {
                    status = true;
                  }
                }
              }
            }
          }
          if (status) {
            // delete item in inventory
            await serviceInventory.insertAsset(
              userWallet,
              req.body.itemId,
              req.body.amount * -1,
              false
            );

            // move data to collection mint
            const mintItem = new Mint({
              walletAddress: userWallet,
              data: {
                itemId: req.body.itemId,
                amount: req.body.amount,
              },
            });
            const resultMintItem = await mintItem.save();

            const itemFilter = itemFind.assets.filter(
              (element) => element.assetId._id == req.body.itemId
            )[0];
            const itemId = parseInt(itemFilter.assetId.no.replace("I", ""));
            const typHash = ethers.utils.id(mintItemWithGame);
            const nonce = await methods.getSequenceNonce(userWallet); // 1 nonce per account
            const signature = await methods.signTwoArg(
              CONTRACT_GAME,
              typHash,
              userWallet,
              nonce,
              itemId,
              parseInt(req.body.amount)
            );
            resolve({
              signature: signature,
              nonce: nonce,
              itemId,
              amount: req.body.amount,
              mint: resultMintItem._id,
            });
          } else {
            reject(ErrorNotFound("Item amount is wrong!!"));
          }
        } else {
          reject(ErrorNotFound("Item not found"));
        }
        reject(ErrorNotFound("Item not found"));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateSigItem(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let body = {};
        body.hash = req.body.status == "wait" ? req.body.hash : "";
        body.status = req.body.status;
        let find = {
          _id: req.body.id,
          walletAddress: userWallet,
        };

        const dataItem = await Mint.findOne(find);
        if (
          (dataItem.status == "create" || dataItem.status == "wait") &&
          (req.body.status == "wait" || req.body.status == "cancel")
        ) {
          const itemData = await Mint.findOneAndUpdate(find, body);
          if (req.body.status == "cancel") {
            // push data
            const reverseItem = await serviceInventory.insertAsset(
              userWallet,
              itemData.data.itemId,
              itemData.data.amount,
              false
            );
            const insertItem = await Inventory.findOne({
              walletAddress: userWallet,
            });
            resolve(insertItem);
          } else {
            resolve(itemData);
          }
        } else {
          reject(ErrorNotFound("status is wrong!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  confirmSigItem(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataFind = { _id: req.body.id, walletAddress: userWallet };
        const find = await Mint.findOne(dataFind);
        if (find.status == "wait") {
          const tokenUpdate = await Mint.findOneAndUpdate(dataFind, {
            status: "close",
          });
          resolve(tokenUpdate);
        } else {
          reject(ErrorNotFound("Status is wrong"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  //token
  sigTokenStack(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUser = await User.findOne({ walletAddress: userWallet });
        const checkAmount = await StakeLog.findOne({
          wallet: userWallet,
          token: req.body.token,
        });
        // check time to claim
        if (checkAmount) {
          if (
            (await serviceStack.checkDayClaimReward(
              userWallet,
              req.body.token
            )) ||
            debug_mint
          ) {
            // token in game
            if (req.body.token == "RBS") {
              await User.updateOne(
                { walletAddress: userWallet },
                {
                  $set: {
                    "mockToken.RBS":
                      dataUser.mockToken.RBS + checkAmount.reward,
                  },
                }
              );
              const result = await serviceStack.confirmTokenTransfer(
                userWallet,
                req.body.token,
                checkAmount.reward,
                "stack"
              );
              resolve(result);
            }

            // token nft DMS or DGS
            else {
              let poolFind = await Pool.findOne({
                type: req.body.token == "DMS" ? "stack" : "all",
                token: req.body.token,
              });
              if (poolFind?.amount > 0) {
                if (checkAmount?.reward > 0) {
                  let totalClaim =
                    poolFind.amount >= checkAmount.reward
                      ? checkAmount.reward
                      : poolFind.amount;
                  const totalClaimWei = ethers.utils.parseEther(
                    totalClaim.toString()
                  );

                  // minus reward in stackLog
                  const result = await serviceStack.confirmTokenTransfer(
                    userWallet,
                    req.body.token,
                    totalClaim,
                    req.body.token == "DMS" ? "stack" : "all"
                  );

                  // move data to collection mint
                  const mintToken = new Mint({
                    walletAddress: userWallet,
                    data: {
                      token: req.body.token,
                      amount: totalClaim,
                    },
                  });
                  const resultMintToken = await mintToken.save();

                  // DMS or DGS
                  const typHash =
                    req.body.token == "DMS"
                      ? ethers.utils.id(mintTokenDMSWithGame)
                      : ethers.utils.id(mintTokenDGSWithGame);
                  const nonce = await methods.getSequenceNonce(userWallet); // 1 nonce per account
                  const signature = await methods.sign(
                    CONTRACT_GAME,
                    typHash,
                    userWallet,
                    nonce,
                    totalClaimWei
                  );
                  resolve({
                    signature: signature,
                    nonce: nonce,
                    token: req.body.token,
                    amount: totalClaim,
                    amountWei: totalClaimWei,
                    mint: resultMintToken._id,
                  });
                } else {
                  reject(ErrorNotFound("Stack amount is zero!!"));
                }
              } else {
                reject(ErrorNotFound("Pool amount is zero!!"));
              }
            }
          } else {
            reject(ErrorBadRequest("Not claim time!!"));
          }
        } else {
          reject(ErrorBadRequest("Not stack log!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  updateSigToken(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        let body = {};
        body.hash = req.body.status == "wait" ? req.body.hash : "";
        body.status = req.body.status;
        let find = {
          _id: req.body.id,
          walletAddress: userWallet,
        };

        const dataToken = await Mint.findOne(find);
        if (
          dataToken.status == "create" &&
          (req.body.status == "wait" || req.body.status == "cancel")
        ) {
          const tokenData = await Mint.findOneAndUpdate(find, body);
          if (req.body.status == "cancel") {
            // push data
            const reverseToken = await serviceStack.reverseStake(
              userWallet,
              dataToken.data.token,
              dataToken.data.amount,
              dataToken.data.token == "DMS" ? "stack" : "all"
            );
            const insertToken = await StakeLog.findOne({
              walletAddress: userWallet,
              token: dataToken.data.token,
            });
            resolve(insertToken);
          } else {
            resolve(tokenData);
          }
        } else {
          reject(ErrorNotFound("status is wrong!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  confirmSigTokenStack(userWallet, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataFind = { _id: req.body.id, walletAddress: userWallet };
        const find = await Mint.findOne(dataFind);
        if (find.status == "wait") {
          const tokenUpdate = await Mint.findOneAndUpdate(dataFind, {
            status: "close",
          });
          resolve(tokenUpdate);
        } else {
          reject(ErrorNotFound("Status is wrong"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
