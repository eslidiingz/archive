const Service = require("../services/farm.service");
const { getUser } = require("../helpers/user");

const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetById(req, res) {
    try {
      const result = await Service.findById(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetWithOwner(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.getWithOwner(user.walletAddress);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onBuyMonster(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.buyMonster(
        user.walletAddress,
        req.body.id,
        req.body.default
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onMonsterReborn(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.reborn(user.walletAddress, req.body.farmId);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
