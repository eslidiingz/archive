const StakeLog = require("../models/StakeLog");
const Pool = require("../models/Pool");
const dayjs = require("dayjs");
const { ErrorNotFound } = require("../configs/errorMethods");
const PoolLogs = require("../models/PoolLogs");

const methods = {
  // userAddress, total amount , [RBS | DMS | DGS]
  calculateStakeAsset(wallet, amount, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const stakeLog = await StakeLog.exists({
          wallet,
          token,
        });

        if (stakeLog) {
          await StakeLog.findOneAndUpdate(
            { wallet, token },
            {
              $push: {
                stakeLog: {
                  $each: [
                    {
                      amount,
                      type: "increment",
                      class: "asset",
                    },
                  ],
                },
              },
            }
          );
        } else {
          const data = {
            wallet,
            token,
          };

          const stake = new StakeLog(data);
          const { _id } = await stake.save();

          await StakeLog.updateOne(
            { _id },
            {
              $push: {
                stakeLog: {
                  $each: [
                    {
                      amount,
                      type: "increment",
                      class: "asset",
                    },
                  ],
                },
              },
            }
          );
        }

        const data = await StakeLog.aggregate([
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
              "stakeLog.type": "increment",
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

        const { reward } = data[0];

        const result = await StakeLog.findOneAndUpdate(
          {
            wallet,
          },
          {
            reward,
          },
          { new: true }
        );

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },

  calculateStakeMonster(stake, token) {
    return new Promise(async (resolve, reject) => {
      try {
        if (token != "DMS" && token != "RBS") {
          resolve(ErrorNotFound("Token not found!!"));
        }
        const { monsters, walletAddress } = stake;

        const monsterList = monsters.filter((item) => item.monsterId !== null);
        const listStake = monsterList.filter((_list) => {
          const assignTime = dayjs(_list.assignTime);

          const prevTime = dayjs().subtract(0, "day");

          const numDay = dayjs(prevTime).diff(assignTime, "second");

          return _list && numDay >= 0;
        });
        console.log(listStake);
        const amount =
          token == "DMS"
            ? listStake.reduce((acc, obj) => acc + obj.monsterId.power, 0)
            : listStake.reduce((acc, obj) => acc + obj.monsterId.powerRed, 0);

        const stakeLog = await StakeLog.exists({
          wallet: walletAddress,
          token,
        });

        if (stakeLog) {
          await StakeLog.findOneAndUpdate(
            { wallet: walletAddress, token },
            {
              $push: {
                stakeLog: {
                  $each: [
                    {
                      amount,
                      type: "increment",
                      class: "monster",
                    },
                  ],
                },
              },
            }
          );
        } else {
          const data = {
            wallet: walletAddress,
            token: token,
          };
          const stake = new StakeLog(data);
          const { _id } = await stake.save();

          await StakeLog.updateOne(
            { _id },
            {
              $push: {
                stakeLog: {
                  $each: [
                    {
                      amount,
                      type: "increment",
                      class: "monster",
                    },
                  ],
                },
              },
            }
          );
        }

        const data = await StakeLog.aggregate([
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
              "stakeLog.type": "increment",
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

        const { reward } = data[0];

        const result = await StakeLog.findOneAndUpdate(
          {
            wallet: walletAddress,
            token,
          },
          {
            reward,
          },
          { new: true }
        );

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  reverseStake(walletAddress, token, amount, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const stakeLog = await StakeLog.exists({
          wallet: walletAddress,
          token,
        });

        await StakeLog.findOneAndUpdate(
          { wallet: walletAddress, token },
          {
            $push: {
              stakeLog: {
                $each: [
                  {
                    amount,
                    type: "increment",
                    class: "reverse stack",
                  },
                ],
              },
            },
          }
        );

        const data = await StakeLog.aggregate([
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
              "stakeLog.type": "increment",
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

        const { reward } = data[0];

        const result = await StakeLog.findOneAndUpdate(
          {
            wallet: walletAddress,
            token,
          },
          {
            reward,
          },
          { new: true }
        );

        // update pool
        const findPool = await Pool.findOne({ token, type });
        token != "RBS"
          ? await Pool.updateOne(
              { token, type },
              { amount: findPool.amount + amount }
            )
          : "";

        const newLog = new PoolLogs({
          type: "reverse stake",
          wallet: walletAddress,
          token,
          amount,
        });
        await newLog.save();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
