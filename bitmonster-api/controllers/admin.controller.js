const farmService = require("../services/farm.service");
const inventoryService = require("../services/inventory.service");
const userLandService = require("../services/userLand.service");
const landClassService = require("../services/landClass.service");
const Burn = require("../models/Burn");

const methods = {
  async onCreateBurn(req, res) {
    try {
      if (!req.body.hash) {
        res.error({ message: "require hash" });
      } else {
        const insertBurn = new Burn({
          walletAddress: req.body.walletAddress,
          hash: req.body.hash,
        });
        const result = await insertBurn.save();
        res.success(result);
      }
    } catch (error) {
      res.error(error);
    }
  },
  async onInsertMonster(req, res) {
    try {
      if (!req.body.hash) {
        res.error({ message: "require hash" });
      } else {
        const burnFind = await Burn.findOne({
          walletAddress: req.body.walletAddress,
          hash: req.body.hash,
          status: "wait",
        });
        if (burnFind) {
          await Burn.findOneAndUpdate(
            {
              walletAddress: req.body.walletAddress,
              _id: burnFind._id,
            },
            {
              status: "close",
            }
          );
          const result = await farmService.buyMonster(
            req.body.walletAddress,
            req.body.id,
            req.body.default
          );
          res.success(result);
        } else {
          res.error({ message: "hash no found" });
        }
      }
    } catch (error) {
      res.error(error);
    }
  },
  async onInsertLand(req, res) {
    try {
      if (!req.body.hash) {
        res.error({ message: "require hash" });
      } else {
        const landClass = landClassService.getClassWithCodeAndIndex(
          req.body.landCode,
          req.body.index
        );
        if (landClass != "ERROR") {
          const burnFind = await Burn.findOne({
            walletAddress: req.body.walletAddress,
            hash: req.body.hash,
            status: "wait",
          });
          if (burnFind) {
            req.body.landClass = landClass;
            req.body.landCode = "L" + req.body.landCode;
            await Burn.findOneAndUpdate(
              {
                walletAddress: req.body.walletAddress,
                _id: burnFind._id,
              },
              {
                status: "close",
              }
            );
            const result = await userLandService.buyLand(
              req.body.walletAddress,
              req
            );
            if (result.id) {
              res.json({
                n: 1,
                nModified: 1,
                ok: 1,
              });
            } else {
              res.json({
                n: 0,
                nModified: 0,
                ok: 1,
              });
            }
          } else {
            res.error({ message: "hash no found" });
          }
          // res.success(result);
        } else {
          res.error("landClass error");
        }
      }
    } catch (error) {
      res.error(error);
    }
  },
  async onInsertAsset(req, res) {
    try {
      if (!req.body.hash) {
        res.error({ message: "require hash" });
      } else {
        const burnFind = await Burn.findOne({
          walletAddress: req.body.walletAddress,
          hash: req.body.hash,
          status: "wait",
        });
        if (burnFind) {
          await Burn.findOneAndUpdate(
            {
              walletAddress: req.body.walletAddress,
              _id: burnFind._id,
            },
            {
              status: "close",
            }
          );
          const result = await inventoryService.insertAsset(
            req.body.walletAddress,
            req.body.assetId,
            req.body.assetAmount,
            req.body.assetTypeAmount
          );
          // assetId, assetAmount, assetTypeAmount
          res.success(result);
        } else {
          res.error({ message: "hash no found" });
        }
      }
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
