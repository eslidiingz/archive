const Inventory = require("../models/Inventory"),
  config = require("../configs/app"),
  Asset = require("../models/Asset"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods"),
  { mapInventoryAmountListToUpdateByType } = require("../helpers/utils");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.type) $or.push({ "assets.assetsId.type": req.body.type });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.body.orderByField && req.body.orderBy)
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
          Inventory.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Inventory.countDocuments(_q.query),
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
        const obj = await Inventory.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
  insertAsset(walletAddress, assetId, assetAmount, assetTypeAmount) {
    return new Promise(async (resolve, reject) => {
      try {
        const setItemBoxCountMax = 99;
        const checkAsset = await Asset.findById(assetId);
        if (typeof assetTypeAmount != "boolean") {
          reject(
            ErrorNotFound(
              "Inventory: request name assetTypeAmount type boolean only."
            )
          );
          return;
        }

        const resAmount = await mapInventoryAmountListToUpdateByType({
          paramsAmount: [],
          valAmountNum: assetAmount,
          valTypeAmount: assetTypeAmount,
          valAmountBoxMax: setItemBoxCountMax,
        });
        if (resAmount instanceof Error) {
          reject(ErrorNotFound(`Inventory: ${resAmount.message}`));
          return;
        }

        const findInventory = await Inventory.findOne({
          walletAddress: walletAddress,
        });

        const newAsset = {
          assetId: checkAsset.id,
          amount: resAmount,
        };
        const data = {
          assets: [newAsset],
          walletAddress: walletAddress,
        };
        if (!findInventory) {
          const obj = new Inventory(data);
          const inserted = await obj.save();
          resolve(inserted);
        } else {
          const getAsset = findInventory.assets.filter(
            (element) => element.assetId == assetId
          );
          if (getAsset.length > 0) {
            const resAmountPlus = await mapInventoryAmountListToUpdateByType({
              paramsAmount: getAsset[0].amount,
              valAmountNum: assetAmount,
              valTypeAmount: assetTypeAmount,
              valAmountBoxMax: setItemBoxCountMax,
            });
            if (resAmountPlus instanceof Error) {
              reject(ErrorNotFound(`Inventory: ${resAmountPlus.message}`));
              return;
            }

            const updateData = await Inventory.update(
              {
                _id: findInventory._id,
                "assets.assetId": assetId,
              },
              {
                $set: {
                  "assets.$.amount": resAmountPlus,
                },
              }
            );
            resolve(updateData);
          } else {
            const pushData = await Inventory.update(
              { _id: findInventory._id },
              { $push: { assets: newAsset } }
            );
            resolve(pushData);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getWithOwner(userWallet, req = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let obj;
        if (req?.body.category) {
          obj = await Inventory.findOne({
            walletAddress: userWallet,
          })
            .populate({
              path: "assets.assetId",
              match: { category: req.body.category },
            })
            .exec();
        } else {
          obj = await Inventory.findOne({
            walletAddress: userWallet,
          }).populate("assets.assetId");
        }
        if (!obj) reject(ErrorNotFound("Inventory: not found"));
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("Inventory: not found"));
      }
    });
  },
};

module.exports = { ...methods };
