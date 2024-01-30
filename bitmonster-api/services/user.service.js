// plugins
const config = require("../configs/app");
const jwt = require("jsonwebtoken");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");
const ethers = require("ethers");

// config
const { useProviderUrl } = require("../helpers/utils");
const ABI_TOKEN = require("../abi/Token.json");

// service
const landService = require("./land.service");
const monsterService = require("./monster.service");
const assetService = require("./asset.service");
//model
const Inventory = require("../models/Inventory");
const User = require("../models/User");
const UserLand = require("../models/UserLand");
const Farm = require("../models/Farm");
const { getUser } = require("../helpers/user");
const utils = require("../helpers/utils");
const energyMax = 20;
const energyNext = 4; // hour
const calcDay = 24 * 60 * 60 * 1000;
const calcHour = 60 * 60 * 1000;
const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.address)
      $or.push({ walletAddress: { $regex: req.query.address } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([User.find(_q.query)])
          .then((result) => {
            const rows = result[0];

            resolve({
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
        const obj = await User.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  updateName(userId, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await User.findById(userId);
        if (!obj) reject(ErrorNotFound("id: not found."));
        if (!/^[A-Z|0-9]+$/.test(data)) {
          reject(ErrorNotFound("name: uppercase letters and numbers only."));
          return;
        }
        const findName = await User.find({ name: data });
        if (findName.length > 0) {
          reject(ErrorNotFound("name: unavailable."));
        } else {
          await User.updateOne({ _id: userId }, { name: data });
          resolve(await User.findById(userId));
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  login(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const newUser = new User(data);
        const landFrees = await landService.getDefault();
        const monsterDefault = await monsterService.getDefault();
        const assetDefault = await assetService.getDefault();

        // find with wallet address
        let obj = await User.findOne({
          walletAddress: data.walletAddress,
        });
        // free land
        for (const landFree of landFrees) {
          const dataLand = {
            walletAddress: data.walletAddress,
            landClass: landFree.landClass,
            landCode: landFree.landCode,
            zone: landFree.zone,
            index: landFree.index,
            default: true,
          };
          !obj ? await new UserLand(dataLand).save() : "";
        }

        // free monster
        let dataMonster = {
          walletAddress: data.walletAddress,
          monsters: [],
        };
        for (const element of monsterDefault) {
          dataMonster.monsters.push({
            monsterId: element._id,
            status: utils.statusDataMonster(element),
          });
        }
        !obj ? await new Farm(dataMonster).save() : "";

        // free asset

        let dataAsset = {
          walletAddress: data.walletAddress,
          assets: [],
        };
        for (const element of assetDefault) {
          const resAmount = await utils.mapInventoryAmountListToUpdateByType({
            paramsAmount: [],
            valAmountNum: element.defaultAmount,
            valTypeAmount: element.default,
            valAmountBoxMax: 99,
          });

          dataAsset.assets.push({
            assetId: element._id,
            amount: resAmount,
          });
        }
        console.log("test", dataAsset);
        !obj ? await new Inventory(dataAsset).save() : "";

        obj = !obj ? await newUser.save() : obj;

        await this.updateEnergy(data.walletAddress);
        obj = await this.getDataAccount(data.walletAddress);
        resolve({
          accessToken: obj.generateJWT(obj),
          userData: await this.getDataAccount(data.walletAddress),
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  refreshToken(accessToken) {
    return new Promise(async (resolve, reject) => {
      try {
        const decoded = jwt.decode(accessToken);
        const obj = await User.findOne({ address: decoded.address });
        if (!obj) {
          reject(ErrorUnauthorized("address not found"));
        }
        resolve({
          accessToken: obj.generateJWT(obj),
          userData: await this.getDataAccount(obj.walletAddress),
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  findAccount(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { walletAddress } = await getUser(req);
        const user = await User.findOne({ walletAddress });
        if (user === null) {
          resolve({
            status: false,
            user: await this.getDataAccount(walletAddress),
          });
        } else {
          resolve({
            status: true,
            user: await this.getDataAccount(walletAddress),
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  getToken(signer, token, walletAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract = await new ethers.Contract(token, ABI_TOKEN, signer);
        const amount = ethers.utils.formatEther(
          await contract.balanceOf(walletAddress)
        );
        resolve(amount);
      } catch (error) {
        resolve(null);
        console.log("get token error");
      }
    });
  },
  getTokenByAccount(walletAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        let customHttpProvider = await new ethers.providers.JsonRpcProvider(
          useProviderUrl
        );
        const signer = await new ethers.Wallet(
          process.env.PRIVATE_KEY,
          customHttpProvider
        );
        let DMS = null;
        while (DMS == null) {
          const result = await methods.getToken(
            signer,
            process.env.CONTRACT_DMS,
            walletAddress
          );
          if (result != null) {
            DMS = result;
          }
        }
        let DGS = null;
        while (DGS == null) {
          const result = await methods.getToken(
            signer,
            process.env.CONTRACT_DGS,
            walletAddress
          );
          if (result != null) {
            DGS = result;
          }
        }
        resolve({ mockToken: { DMS, DGS } });
      } catch (error) {
        reject(ErrorNotFound("Get token fail"));
      }
    });
  },
  getDataAccount(walletAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findOne({ walletAddress });
        // user.mockToken.DMS = DMS;
        // user.mockToken.DGS = DGS;
        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
  },

  updateEnergy(userAddress, energy = null) {
    let dataUpdateEnergy;
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ walletAddress: userAddress });
        const dateNow = new Date();
        if (energy != null) {
          if (user.energy.amount + energy < 0) {
            reject(ErrorNotFound("user not have energy"));
          } else {
            dataUpdateEnergy =
              user.energy.amount + energy < energyMax
                ? user.energy.amount + energy
                : energyMax;
            const dateNext = new Date();
            dateNext.setTime(dateNow.getTime() + calcHour * energyNext);
            await User.updateOne(
              { walletAddress: userAddress },
              {
                $set: {
                  energy: {
                    amount: dataUpdateEnergy,
                    updateTime:
                      energy < 0 && user.energy.amount + energy == energyMax - 1
                        ? dateNow
                        : user.energy.amount + energy >= 20
                        ? null
                        : user.energy.updateTime,
                    nextTime:
                      energy < 0 && user.energy.amount + energy == energyMax - 1
                        ? dateNext
                        : user.energy.amount + energy >= 20
                        ? null
                        : user.energy.nextTime,
                  },
                },
              }
            );
            resolve(await this.getDataAccount(userAddress));
          }
        } else {
          if (user.energy.updateTime != null) {
            const checkDate = Math.floor(
              (dateNow - user.energy.updateTime) / (calcHour * energyNext)
            );
            const updateDate = new Date(
              user.energy.updateTime.setTime(
                user.energy.updateTime.getTime() +
                  calcHour * energyNext * checkDate
              )
            );
            const nextDate = new Date(
              user.energy.updateTime.setTime(
                user.energy.updateTime.getTime() + calcHour * energyNext
              )
            );
            dataUpdateEnergy =
              user.energy.amount + checkDate < energyMax
                ? user.energy.amount + checkDate
                : energyMax;
            const dataUpdate = {
              amount: dataUpdateEnergy,
              updateTime:
                dataUpdateEnergy < energyMax
                  ? checkDate > 0
                    ? updateDate
                    : user.energy.updateTime
                  : null,
              nextTime:
                dataUpdateEnergy < energyMax
                  ? checkDate > 0
                    ? nextDate
                    : user.energy.nextTime
                  : null,
            };
            // console.log(checkDate);
            if (checkDate > 0) {
              await User.updateOne(
                { walletAddress: userAddress },
                {
                  $set: {
                    energy: dataUpdate,
                  },
                }
              );
              resolve(await this.getDataAccount(userAddress));
            } else {
              resolve(await this.getDataAccount(userAddress));
            }
          } else {
            resolve("not update");
          }
        }
      } catch (error) {
        reject(ErrorNotFound(error));
      }
    });
  },
};

module.exports = { ...methods };
