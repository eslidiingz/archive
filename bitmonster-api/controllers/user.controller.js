const Service = require("../services/user.service");
const { getUser } = require("../helpers/user");
const dayjs = require("dayjs");
const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateName(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.updateName(user.id, req.body.name);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onLogin(req, res) {
    try {
      let result = await Service.login(req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onRefreshToken(req, res) {
    try {
      let result = await Service.refreshToken(req.body.accessToken);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onServerTime(req, res) {
    try {
      const time = new Date();
      res.success(time);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetAccount(req, res) {
    try {
      const result = await Service.findAccount(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetTokenByAccount(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.getTokenByAccount(user.walletAddress);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateEnergy(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.updateEnergy(user.walletAddress, null);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
