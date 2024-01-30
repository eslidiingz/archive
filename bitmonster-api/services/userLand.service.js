const Farm = require("../models/Farm");
const UserLand = require("../models/UserLand");
const Asset = require("../models/Asset");
const Inventory = require("../models/Inventory");
const Land = require("../models/Land");
const LandClass = require("../models/LandClass");
const LandCode = require("../models/LandCode");
const Habit = require("../models/Habit");
const Evo = require("../models/Evo");
const utils = require("../helpers/utils");
const config = require("../configs/app");
const { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");
const serviceUser = require("./user.service");
const serviceInventory = require("./inventory.service");
const calcDay = 24 * 60 * 60 * 1000;
const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.active) $or.push({ active: req.body.active });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: 1 };
    if (req.body.orderByField && req.query.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const limit = +(req.body.size || config.pageLimit);
    const offset = +(limit * ((req.body.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          UserLand.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          UserLand.countDocuments(_q.query),
        ])
          .then((result) => {
            const rows = result[0],
              count = result[1];
            resolve({
              total: count,
              lastPage: Math.ceil(count / limit),
              currPage: +req.body.page || 1,
              rows: rows,
            });
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  },

  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
  buyLand(userAddress, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const landClass = await LandClass.findOne({ _id: req.body.landClass });
        const landCode = await LandCode.findOne({ _id: req.body.landCode });
        if (!landClass) reject(ErrorNotFound("landClass: not found"));
        if (!landCode) reject(ErrorNotFound("landCode: not found"));

        const obj = await new UserLand({
          walletAddress: userAddress,
          landClass: req.body.landClass,
          landCode: req.body.landCode,
          zone: req.body.zone,
          index: req.body.index,
          default: req.body.default,
        }).save();
        if (!obj) reject(ErrorNotFound("Buy: Error"));
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("Buy: Error (try)"));
      }
    });
  },
  getWithOwner(userAddress, req = null) {
    let query = { walletAddress: userAddress };
    if (req?.body) {
      if (req?.body.active != null) query.active = req.body.active;
    }
    // console.log(query);
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.find(query)
          .sort({ activeTime: 1, createdAt: 1 })
          .populate("monsters.monsterId")
          .populate("assets.assetId");
        if (!obj) reject(ErrorNotFound("wallet: not found"));
        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  },
  updateActive(userAddress, id, active) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        });
        if (!obj) reject(ErrorNotFound("Land: not found"));
        await UserLand.updateOne(
          { _id: id },
          { active: active, activeTime: active ? new Date() : null }
        );
        resolve(Object.assign(obj, { active: active }));
      } catch (error) {
        reject(error);
      }
    });
  },
  assignAsset(userAddress, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: req.body.id,
        }).populate("assets.assetId");
        const dataAsset = await Asset.findOne({ _id: req.body.assetId });
        const landSupportAsset =
          dataAsset && dataAsset.landCode
            ? dataAsset.landCode.filter(
                (element) => element == obj.landCode._id
              ).length > 0
            : true;
        const filterCoordinate = obj.assets.filter(
          (element) =>
            element.coordinate.x == req.body.x &&
            element.coordinate.y == req.body.y
        );
        if (!obj) reject(ErrorNotFound("Land: not found"));
        if (!obj.active) {
          reject(ErrorNotFound("Land: Not active"));
        } else if (!dataAsset) {
          reject(ErrorNotFound("Asset: Not found"));
        } else if (obj.assets.length + 1 > obj.landClass.maxItem) {
          reject(ErrorNotFound("Land: Item over limit"));
        } else if (!landSupportAsset) {
          reject(ErrorNotFound("Asset: Land not support"));
        } else if (filterCoordinate.length > 0) {
          reject(ErrorNotFound("Land: Coordinate not available"));
        } else {
          const findInventory = await Inventory.findOne({
            walletAddress: userAddress,
          }).populate("assets.assetId");
          if (!findInventory) reject(ErrorNotFound("Inventory: not inventory"));

          // console.log(findInventory.assets);
          const getAsset = findInventory.assets.filter((element) => {
            const findId = element.assetId.id == req.body.assetId;
            let defaultData = false;
            for (const stack of element.amount) {
              defaultData =
                stack.default == req.body.assetType && stack.stack.length > 0
                  ? true
                  : defaultData;
            }
            if (defaultData && findId) {
              return element;
            }
          });
          // console.log(getAsset);
          if (getAsset.length < 1) {
            reject(ErrorNotFound("Asset: 0 item"));
          } else {
            await serviceInventory.insertAsset(
              userAddress,
              req.body.assetId,
              -1,
              req.body.assetType
            );

            const dateNow = new Date();
            let nextTime = null;
            if (getAsset[0].assetId.time) {
              const numDiff = getAsset[0].assetId.time / 24;
              nextTime = new Date();
              nextTime.setTime(nextTime.getTime() + numDiff * calcDay);
            }
            const update = await UserLand.update(
              { _id: req.body.id },
              {
                $push: {
                  assets: {
                    assetId: req.body.assetId,
                    coordinate: { x: req.body.x, y: req.body.y },
                    storage: {
                      nextTime: nextTime,
                      updateTime: dateNow,
                    },
                    assignTime: dateNow,
                    default: req.body.assetType,
                  },
                },
              }
            );
            resolve(update);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  removeAsset(userAddress, id, assignId) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
          "assets._id": assignId,
        });
        if (!obj) {
          reject(ErrorNotFound("Land or Assign Asset: Not found"));
        } else {
          const filterObj = obj.assets.filter(
            (element) => element._id == assignId
          );
          if (filterObj.length > 0) {
            await serviceInventory.insertAsset(
              userAddress,
              filterObj[0].assetId,
              1,
              filterObj[0].default
            );
            const update = await UserLand.updateOne(
              { _id: id, walletAddress: userAddress },
              {
                $pull: {
                  assets: { _id: assignId },
                },
              }
            );
            resolve(update);
          } else {
            reject(ErrorNotFound("Asset in Land not found"));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  resetAsset(userAddress, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        });
        if (!obj) {
          reject(ErrorNotFound("Land: Not found"));
        } else {
          for (const element of obj.assets) {
            await this.removeAsset(
              userAddress,
              id,
              JSON.parse(JSON.stringify(element._id))
            );
          }
          resolve(await this.getUserLandWithId(userAddress, id));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  assignMonster(userAddress, req) {
    // console.log(utils);
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: req.body.id,
        });
        const dataFarm = await Farm.findOne({
          walletAddress: userAddress,
          "monsters._id": req.body.farmId,
        }).populate("monsters.monsterId");
        if (!obj.active) {
          reject(ErrorNotFound("Land: Not active"));
        } else if (obj.monsters.length + 1 > 4) {
          reject(ErrorNotFound("Land: Monster over limit"));
        } else if (!dataFarm) {
          reject(ErrorNotFound("Farm: Monster not found"));
        } else {
          const dataFarmFilter = dataFarm.monsters.filter(
            (element) => element._id == req.body.farmId
          );
          const removeMonsterInFarm = await Farm.updateOne(
            { _id: dataFarm._id, walletAddress: userAddress },
            {
              $pull: {
                monsters: { _id: req.body.farmId },
              },
            }
          );
          // const habit = await utils.getHabitMonster();
          const now = new Date();
          const nextTime = now;
          nextTime.setDate(nextTime.getDate() + 1);
          const nextHabitTime = now;
          nextHabitTime.setTime(nextTime.getTime() + calcDay / 24);
          const habitTime = {
            updateTime: now,
            // nextTime : now+time,
          };
          console.log("dataFarmFilter[0]", dataFarmFilter[0]);
          console.log(
            "utils",
            utils.statusDataMonster(dataFarmFilter[0].status)
          );
          const insertMonster = await UserLand.update(
            { _id: req.body.id },
            {
              $push: {
                monsters: {
                  monsterId: dataFarmFilter[0].monsterId.id,
                  status: utils.statusDataMonster(dataFarmFilter[0].status),
                  nextTime: nextTime,
                },
              },
            }
          );
          resolve(insertMonster);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  removeMonster(userAddress, id, assignId) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          _id: id,
          walletAddress: userAddress,
          "monsters._id": assignId,
        });
        if (!obj) reject(ErrorNotFound("Land or Monster: not found"));
        const filterMonster = await obj.monsters.filter((element) => {
          if (element._id == assignId) return element;
        });
        if (filterMonster.length > 0) {
          const removeMonsterInUserLand = await UserLand.updateOne(
            { _id: id, walletAddress: userAddress },
            {
              $pull: {
                monsters: { _id: assignId },
              },
            }
          );
          const reverseMonster = await Farm.update(
            { walletAddress: userAddress },
            {
              $push: {
                monsters: {
                  monsterId: filterMonster[0].monsterId,
                  status: filterMonster[0].status,
                },
              },
            }
          );
          if (!reverseMonster) {
            reject(ErrorNotFound("Farm: update monster error"));
          } else {
            resolve(reverseMonster);
          }
        } else {
          reject(ErrorNotFound("Monster: not found"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  updateInLands(userAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.find({
          walletAddress: userAddress,
        });
        for (const element of obj) {
          await this.incrementAsset(userAddress, element._id);
          await this.monsterUpdate(userAddress, element._id);
        }
        let newData = await UserLand.find({
          walletAddress: userAddress,
        })
          .populate("assets.assetId")
          .populate("monsters.monsterId");
        resolve(newData);
      } catch (error) {
        reject(error);
      }
    });
  },
  incrementAsset(userAddress, id) {
    // userLandId , asset , check time
    return new Promise(async (resolve, reject) => {
      try {
        const dataUserLand = await this.getUserLandWithId(userAddress, id);
        if (!dataUserLand) {
          reject(ErrorNotFound("UserLand: not found"));
        } else {
          const nowDate = new Date();
          const dataAssetFilter = dataUserLand.assets.filter((element) => {
            if (element.assetId.time) {
              const numDiff = element.assetId.time / 24;
              const dateUpdateTime = new Date();
              dateUpdateTime.setDate(element.storage.updateTime.getDate());
              dateUpdateTime.setTime(element.storage.updateTime.getTime());
              const dateAssign = new Date();
              dateAssign.setDate(element.assignTime.getDate());
              dateAssign.setTime(element.assignTime.getTime());
              // check dateAssign more numDiff day
              dateAssign.setTime(dateAssign.getTime() + numDiff * calcDay);

              const diffDay = nowDate - dateAssign;

              // check this day not update
              dateUpdateTime.setTime(
                dateUpdateTime.getTime() + numDiff * calcDay
              );
              const lastUpdate = nowDate - dateUpdateTime;

              if (diffDay >= 0 && lastUpdate >= 0) {
                return element;
              }
            }
          });
          for (const element of dataAssetFilter) {
            const dateUpdateTime = new Date();
            dateUpdateTime.setDate(element.storage.updateTime.getDate());
            dateUpdateTime.setTime(element.storage.updateTime.getTime());

            const numDiff = element.assetId.time / 24;
            const diffCount = Math.floor(
              Math.abs(nowDate - dateUpdateTime) / (numDiff * calcDay)
            );
            dateUpdateTime.setTime(
              element.storage.updateTime.getTime() +
                diffCount * numDiff * calcDay
            );

            const nextTime = new Date();
            nextTime.setTime(dateUpdateTime.getTime() + numDiff * calcDay);
            let amountUpdate =
              element.storage.amount + element.assetId.num * diffCount;
            if (element.assetId.type.toLowerCase() == "t3") {
              await serviceUser.updateEnergy(userAddress, amountUpdate);
              amountUpdate = 0;
            } else if (
              element.assetId.type.toLowerCase() == "t5" &&
              element.assetId.status.toLowerCase() == "emotion"
            ) {
              await this.updateEmotion(userAddress, id, amountUpdate);
              amountUpdate = 0;
            } else if (
              element.assetId.type.toLowerCase() == "t5" &&
              element.assetId.status.toLowerCase() == "habit"
            ) {
              await this.updateHabit(userAddress, id, amountUpdate);
              amountUpdate = 0;
            }
            await UserLand.update(
              {
                _id: id,
                "assets._id": element._id,
              },
              {
                $set: {
                  "assets.$.storage.amount": amountUpdate,
                  "assets.$.storage.updateTime": dateUpdateTime,
                  "assets.$.storage.nextTime": nextTime,
                },
              }
            );
          }
          resolve(await this.getUserLandWithId(userAddress, id));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  monsterUpdate(userAddress, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUserLand = await this.getUserLandWithId(userAddress, id);
        if (!dataUserLand) {
          reject(ErrorNotFound("UserLand: not found"));
        } else {
          const nowDate = new Date();
          const dataMonsterFilter = dataUserLand.monsters.filter((element) => {
            const dateUpdateTime = new Date();
            dateUpdateTime.setDate(element.updateTime.getDate());
            dateUpdateTime.setTime(element.updateTime.getTime());
            const dateAssign = new Date();
            dateAssign.setDate(element.assignTime.getDate());
            dateAssign.setTime(element.assignTime.getTime());
            // check dateAssign more numDiff day
            dateAssign.setTime(dateAssign.getTime() + calcDay);

            const diffDay = nowDate - dateAssign;
            // check this day not update
            dateUpdateTime.setTime(dateUpdateTime.getTime() + calcDay);
            const lastUpdate = nowDate - dateUpdateTime;

            if (!element.status.dead && diffDay >= 0 && lastUpdate >= 0) {
              return element;
            }
          });
          for (const elementMonster of dataMonsterFilter) {
            const updateTime = new Date();
            updateTime.setDate(elementMonster.updateTime.getDate());
            updateTime.setTime(elementMonster.updateTime.getTime());
            const divDay = Math.floor((nowDate - updateTime) / calcDay);
            let status = {
              age: elementMonster.status.age,
              dead: elementMonster.status.dead,
              life: elementMonster.status.life,
              lv: elementMonster.status.lv,
              habit: {
                amount: elementMonster.status.habit.amount,
              },
              evo: elementMonster.status.evo,
              default: elementMonster.status.default,
            };
            for (let i = 0; i < divDay; i++) {
              const dataAsset = await this.getUserLandWithId(userAddress, id);
              const dataAssetFilter = dataAsset.assets.filter(
                (element) => element.assetId.type.toLowerCase() == "t1"
              );
              let countAsset = 0;
              for (const element of dataAssetFilter) {
                countAsset += element.storage.amount;
              }
              if (status.dead) {
                break;
              }
              if (status.age + 0.05 > 10) {
                // die
                status.dead = true;
              } else {
                status.age = status.age + 0.05;
                if (elementMonster.monsterId.food > countAsset) {
                  //no food | minus status.life,
                  status.life--;
                  // if life == 0 to die
                  status.dead = status.life <= 0 ? true : false;
                } else {
                  // have food | minus asset
                  let requireFood = elementMonster.monsterId.food;
                  for (const element of dataAssetFilter) {
                    const haveFood = element.storage.amount;
                    const removeFood =
                      haveFood - requireFood >= 0 ? requireFood : haveFood;
                    const summary =
                      haveFood - requireFood < 0 ? 0 : haveFood - requireFood;

                    requireFood -= removeFood;
                    if (requireFood < 0) {
                      break;
                    } else {
                      await UserLand.update(
                        {
                          walletAddress: userAddress,
                          _id: id,
                          "assets._id": element._id,
                        },
                        {
                          $set: {
                            "assets.$.storage.amount": summary,
                          },
                        }
                      );
                    }
                  }
                }
              }

              //updateTime, nextTime , status
              // console.log("start updateTime", updateTime);
              updateTime.setTime(updateTime.getTime() + calcDay);
              // console.log("Now updateTime", updateTime);

              const nextTime = new Date();
              nextTime.setDate(updateTime.getDate());
              nextTime.setTime(updateTime.getTime());

              nextTime.setTime(nextTime.getTime() + calcDay);
              // console.log("Next Time", nextTime);

              await UserLand.update(
                {
                  walletAddress: userAddress,
                  _id: id,
                  "monsters._id": elementMonster._id,
                },
                {
                  $set: {
                    "monsters.$.status": status,
                    "monsters.$.updateTime": updateTime,
                    "monsters.$.nextTime": nextTime,
                    "monsters.$.lv": elementMonster.status.lv,
                  },
                }
              );
            }
          }
          resolve(await this.getUserLandWithId(userAddress, id));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getUserLandWithId(userAddress, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUserLand = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        })
          .populate("assets.assetId")
          .populate("monsters.monsterId");
        resolve(dataUserLand);
      } catch (error) {
        reject(error);
      }
    });
  },
  resetLand(userAddress, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUserLand = await this.getUserLandWithId(userAddress, id);
        const resetAsset = await this.resetAsset(userAddress, id);
        for (const monster of dataUserLand.monsters) {
          const removeMonster = await this.removeMonster(
            userAddress,
            id,
            JSON.parse(JSON.stringify(monster._id))
          );
        }
        await this.updateActive(userAddress, id, false);
        resolve(await this.getUserLandWithId(userAddress, id));
      } catch (error) {
        reject(error);
      }
    });
  },
  evoMonster(userAddress, id, monster) {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUserLand = await this.getUserLandWithId(userAddress, id);
        const maxEvo = await Evo.findOne({}).sort({ evo: -1 });
        const filter = dataUserLand.monsters.filter(
          (element) => element._id == monster
        );
        if (filter.length > 0 && filter[0].status.evo < maxEvo.evo) {
          const evo = await Evo.findOne({ evo: filter[0].status.evo + 1 });
          resolve(evo);
          resolve(await this.getUserLandWithId(userAddress, id));
        } else {
          reject(ErrorNotFound("Not found monster or evo max lv."));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  updateEmotion(userAddress, id, amount) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        });
        if (!obj) {
          reject(ErrorNotFound("userLand not found"));
        } else {
          const tempFilter = obj.monsters.filter((element) => {
            const now = new Date();
            const dateAssignTime = new Date();
            dateAssignTime.setDate(element.assignTime.getDate());
            dateAssignTime.setTime(element.assignTime.getTime() + calcDay);
            if (now - dateAssignTime >= 0 && element.status.emotion < 10) {
              return element;
            }
          });
          for (const data of tempFilter) {
            await UserLand.update(
              { _id: id, "monsters._id": data._id },
              {
                $set: {
                  "monsters.$.status.emotion": data.status.emotion + amount,
                },
              }
            );
          }
          resolve(await this.getUserLandWithId(userAddress, id));
        }
      } catch (error) {
        reject(ErrorNotFound(error));
      }
    });
  },
  updateHabit(userAddress, id, amount) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        });
        if (!obj) {
          reject(ErrorNotFound("userLand not found"));
        } else {
          const tempFilter = obj.monsters.filter((element) => {
            const now = new Date();
            const dateAssignTime = new Date();
            dateAssignTime.setDate(element.assignTime.getDate());
            dateAssignTime.setTime(element.assignTime.getTime() + calcDay);
            if (now - dateAssignTime >= 0 && element.status.habit.amount > 0) {
              return element;
            }
          });
          for (const data of tempFilter) {
            await UserLand.update(
              { _id: id, "monsters._id": data._id },
              {
                $set: {
                  "monsters.$.status.habit.amount":
                    data.status.habit.amount - amount,
                },
              }
            );
          }
          resolve(await this.getUserLandWithId(userAddress, id));
        }
      } catch (error) {
        reject(ErrorNotFound(error));
      }
    });
  },
  decrementHabit(userAddress, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await UserLand.findOne({
          walletAddress: userAddress,
          _id: id,
        }).populate("monsters.monsterId");
        if (!obj) {
          reject(ErrorNotFound("userLand not found"));
        } else {
          const habitTime = await Habit.find({});
          const tempFilter = obj.monsters.filter(async (element) => {
            const dataHabitFilter = await utils.getHabitMonster(
              element.monsterId.rank
            );
            console.log("dataHabitFilter", dataHabitFilter);
            const now = new Date();
            const dateAssignTime = new Date();
            dateAssignTime.setDate(element.assignTime.getDate());
            dateAssignTime.setTime(
              element.assignTime.getTime() +
                (calcDay / 24) * dataHabitFilter.time
            );
            if (now - dateAssignTime >= 0) {
              return element;
            }
          });
          // for (const data of tempFilter) {
          //   await UserLand.update(
          //     { _id: id, "monsters._id": data._id },
          //     {
          //       $set: {
          //         "monsters.$.status.habit.amount":
          //           data.status.habit.amount - amount,
          //       },
          //     }
          //   );
          // }
          // resolve(await this.getUserLandWithId(userAddress, id));
          resolve(tempFilter);
        }
      } catch (error) {
        reject(ErrorNotFound(error));
      }
    });
  },
};

module.exports = { ...methods };
