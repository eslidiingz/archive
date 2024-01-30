const { ErrorNotFound } = require("../configs/errorMethods");
const { decodeKey, encodeKey } = require("../helpers/crypto-js");
const utils = require("../helpers/utils");

// models
const UserLand = require("../models/UserLand");
const Farm = require("../models/Farm");
const Monster = require("../models/Monster");

// services
const farmService = require("../services/farm.service");

const methods = {
  async encodeKey(req, res) {
    try {
      const result = encodeKey(req.body.walletAddress);
      res.success({ key: result });
    } catch (error) {
      res.error(error);
    }
  },
  async decodeKey(req, res) {
    try {
      const result = await decodeKey(req.body.hash);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async removeAllMonsterAndInsertOne(req, res) {
    try {
      const findMonster = await Monster.findOne({ _id: req.body.id });
      if (!findMonster) {
        reject(ErrorNotFound("Monster : Not found"));
        return;
      } else {
        const removeUserLand = await UserLand.updateMany(
          {},
          {
            monsters: [],
          },
          { multi: true }
        );
        const removeFarm = await Farm.updateMany(
          {},
          {
            monsters: [],
          },
          { multi: true }
        );

        const findUserLand = await UserLand.find({
          "monsters.$.monsterId": req.body.monsterId,
        });
        const findFarm = await Farm.find({
          "monsters.$.monsterId": req.body.monsterId,
        });

        let monsterData = utils.statusDataMonster(findMonster);
        monsterData.default = true;
        const insertMonster = await Farm.updateMany(
          {},
          {
            $push: {
              monsters: {
                monsterId: req.body.id,
                status: monsterData,
              },
            },
          }
        );

        res.success({
          removeUserLand,
          removeFarm,
          findUserLand,
          findFarm,
          insertMonster,
        });
      }
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
