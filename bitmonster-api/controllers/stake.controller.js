const Service = require("../services/stakelog.service");

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

  async onStake(req, res) {
    try {
      const result = await Service.stakeMonster(req.body.token);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  // async onUnstake(req, res) {
  //   try {
  //     const result = await Service.unstakeReward(req);
  //     res.success(result);
  //   } catch (error) {
  //     res.error(error);
  //   }
  // },
};

module.exports = { ...methods };
