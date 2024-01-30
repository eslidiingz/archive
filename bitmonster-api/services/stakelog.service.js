const config = require("../configs/app"),
  {
    ErrorBadRequest,
    ErrorNotFound,
    ErrorNotModified,
  } = require("../configs/errorMethods"),
  StakeLog = require("../models/StakeLog"),
  Pool = require("../models/Pool"),
  UserLand = require("../models/UserLand"),
  { getUser } = require("../helpers/user");
const {
  calculateStakeMonster,
  reverseStake,
} = require("../helpers/stake.helper");
const ClaimLog = require("../models/ClaimLog");
const PoolLogs = require("../models/PoolLogs");
const { claim } = require("./claim.service");
const dayjs = require("dayjs");
const User = require("../models/User");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.wallet) $or.push({ wallet: { $regex: req.body.wallet } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { no: 1 };
    if (req.body.orderByField && req.body.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([StakeLog.find(_q.query)])
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
        const obj = await StakeLog.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  async stakeMonster(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const monster = await UserLand.find({
          active: true,
          monsters: {
            $exists: true,
            $not: {
              $size: 0,
            },
          },
        }).populate("monsters.monsterId");

        const data = monster.map(async (item) => {
          return await calculateStakeMonster(item, token);
        });

        const result = await Promise.all(data);

        resolve(result);
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },
  async reverseStake(walletAddress, token, amount, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await reverseStake(walletAddress, token, amount, type);

        resolve(result);
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },

  // await methods.confirmTokenTransfer(req);
  // const status = await claim(result);
  async checkDayClaimReward(walletAddress, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const claimExist = await ClaimLog.exists({
          wallet: walletAddress,
          token,
        });

        if (claimExist) {
          const logs = await ClaimLog.findOne({ wallet: walletAddress, token })
            .sort({ round: -1 })
            .limit(1);

          if (dayjs().isAfter(logs.nextround_at)) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },

  // type == all,stack
  async confirmTokenTransfer(walletAddress, token, amount, type = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const stakeLog = await StakeLog.findOne({
          wallet: walletAddress,
          token,
        });
        const totalAmount = amount != null ? amount : stakeLog.reward;
        await StakeLog.findOneAndUpdate(
          {
            wallet: walletAddress,
            token,
          },
          {
            $push: {
              stakeLog: {
                $each: [
                  {
                    amount: totalAmount,
                    type: "decreasement",
                  },
                ],
              },
            },
          }
        );

        const stakeLogGroup = await StakeLog.aggregate([
          {
            $match: {
              wallet: walletAddress,
              token,
            },
          },
          { $unwind: { path: "$stakeLog" } },
          {
            $match: {
              "stakeLog.active": "Y",
            },
          },
          {
            $group: {
              _id: { type: "$stakeLog.type" },
              reward: {
                $sum: {
                  $sum: "$stakeLog.amount",
                },
              },
            },
          },
        ]);

        const sumIncrement = stakeLogGroup.reduce(
          (acc, obj) => acc + (obj._id.type === "increment" ? obj.reward : 0),
          0
        );
        const sumDecreasement = stakeLogGroup.reduce(
          (acc, obj) =>
            acc + (obj._id.type === "decreasement" ? obj.reward : 0),
          0
        );

        await StakeLog.findOneAndUpdate(
          {
            wallet: walletAddress,
            token,
          },
          {
            $set: {
              "stakeLog.$[].active": "N",
            },
          }
        );

        const result = await StakeLog.findOneAndUpdate(
          {
            wallet: walletAddress,
            token,
          },
          {
            reward: sumIncrement - sumDecreasement,
          },
          { new: true }
        );

        // const { token, wallet } = data;

        const stake = await ClaimLog.findOne({ wallet: walletAddress })
          .sort({ round: -1 })
          .limit(1);

        const claim = new ClaimLog({
          token,
          wallet: walletAddress,
          round: stake === null ? 0 : stake.round + 1,
        });

        // update pool
        const findPool = await Pool.findOne({ token, type });
        token != "RBS"
          ? await Pool.updateOne(
              { token, type },
              { amount: findPool.amount - amount }
            )
          : "";

        const newLog = new PoolLogs({
          type,
          wallet: walletAddress,
          token,
          amount: totalAmount * -1,
        });
        await newLog.save();

        const updateClaim = await claim.save();
        resolve({ status: "success", message: updateClaim });
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },
};

module.exports = { ...methods };
