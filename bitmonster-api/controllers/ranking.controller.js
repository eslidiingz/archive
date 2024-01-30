const Service = require("../services/ranking.service");
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

  async onEndMatch(req, res) {
    try {
      const result = await Service.endMatch(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onStartMatch(req, res) {
    try {
      const result = await Service.startMatch(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onRanking(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.rankingNow(
        req.query.type,
        user ? user.walletAddress : null
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  // async onTest(req, res) {
  //   try {
  //     const result = await Service.testInsert();
  //     res.success(result);
  //   } catch (error) {
  //     res.error(error);
  //   }
  // },
};

module.exports = { ...methods };
