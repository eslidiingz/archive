const Farm = require("../models/Farm"),
  Monster = require("../models/Monster"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");
const utils = require("../helpers/utils");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.title) $or.push({ title: { $regex: req.query.title } });
    if (req.query.description)
      $or.push({ description: { $regex: req.query.description } });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const limit = +(req.query.size || config.pageLimit);
    const offset = +(limit * ((req.query.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Farm.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Farm.countDocuments(_q.query),
        ])
          .then((result) => {
            const rows = result[0],
              count = result[1];
            resolve({
              total: count,
              lastPage: Math.ceil(count / limit),
              currPage: +req.query.page || 1,
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
        const obj = await Farm.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
  buyMonster(userAddress, monsterId, defaultMonster = true) {
    return new Promise(async (resolve, reject) => {
      try {
        const monster = await Monster.findOne({ _id: monsterId });
        if (!monster) reject(ErrorNotFound("Monster: not found"));
        let monsterData = utils.statusDataMonster(monster);
        monsterData.default = defaultMonster;
        console.log(monsterData);
        const obj = await Farm.updateOne(
          { walletAddress: userAddress },
          {
            $push: {
              monsters: {
                monsterId: monsterId,
                status: monsterData,
              },
            },
          }
        );
        if (!obj) reject(ErrorNotFound("Monster: Error"));
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("Monster: Error (try)"));
      }
    });
  },
  getWithOwner(userWallet) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Farm.findOne({
          walletAddress: userWallet,
        }).populate("monsters.monsterId");
        if (!obj) reject(ErrorNotFound("Farm: not found"));
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("Farm: not found"));
      }
    });
  },
  reborn(userWallet, farmId) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Farm.findOne({
          walletAddress: userWallet,
          "monsters._id": farmId,
        });
        if (obj) {
          const filterObj = obj.monsters.filter(
            (element) => element._id == farmId
          )[0];
          const removeOldMonster = await Farm.updateOne(
            { _id: obj.id, walletAddress: userWallet },
            {
              $pull: {
                monsters: { _id: filterObj._id },
              },
            }
          );
          const addMonster = await methods.buyMonster(
            userWallet,
            filterObj.monsterId,
            filterObj.status.default
          );
          resolve(addMonster);
        } else {
          reject(ErrorNotFound("Farm: not found"));
        }
      } catch (error) {
        reject(ErrorNotFound("Farm: not found"));
      }
    });
  },
};

module.exports = { ...methods };
