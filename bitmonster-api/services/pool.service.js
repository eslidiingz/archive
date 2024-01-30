// plugins
const config = require("../configs/app");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");

//model
const Pool = require("../models/Pool");
const PoolConfig = require("../models/PoolConfig");
const PoolLogs = require("../models/PoolLogs");
const utils = require("../helpers/utils");

const calcDay = 24 * 60 * 60 * 1000;
const checkPoolDay = 30;

const methods = {
  initPool() {
    return new Promise(async (resolve, reject) => {
      try {
        const findPoolConfigs = await PoolConfig.find();
        const dateNow = new Date();
        const dateNext = new Date();
        if (findPoolConfigs.length > 0) {
          for (const findPoolConfig of findPoolConfigs) {
            dateNext.setTime(dateNow.getTime() + calcDay * findPoolConfig.day);
            const update = await Pool.findOneAndUpdate(
              {
                type: findPoolConfig.type,
                token: findPoolConfig.token,
                amount: 0,
                total: 0,
                updateTime: null,
                nextTime: null,
              },
              {
                amount: findPoolConfig.amount,
                total: findPoolConfig.amount,
                updateTime: dateNow,
                nextTime: dateNext,
              }
            );
          }
          resolve(await Pool.find());
        } else {
          reject(ErrorNotFound("Pool config: Not found!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  addPool(type) {
    return new Promise(async (resolve, reject) => {
      try {
        const findPools = await Pool.find();
        const dateNow = new Date();
        const dateNext = new Date();
        if (findPools.length > 0) {
          for (const findPool of findPools) {
            const findPoolConfig = await PoolConfig.findOne({
              type: findPool.type,
              token: findPool.token,
              day: type,
            });
            console.log(
              "findPoolConfig &&  dateNow >= findPool.nextTime",
              findPoolConfig && dateNow >= findPool.nextTime
            );
            if (findPoolConfig && dateNow >= findPool.nextTime) {
              dateNext.setTime(
                findPool.nextTime.getTime() + calcDay * checkPoolDay
              );
              const update = await Pool.findOneAndUpdate(
                {
                  type: findPool.type,
                  token: findPool.token,
                },
                {
                  amount: findPool.amount + findPoolConfig.amount,
                  total: findPool.total + findPoolConfig.amount,
                  updateTime: findPool.nextTime,
                  nextTime: dateNext,
                }
              );
              console.log("update", update);
            }
          }
          resolve(await Pool.find());
        } else {
          reject(ErrorNotFound("Pool config: Not found!!"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getPool() {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await Pool.find());
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
