const Service = require("../services/metadata.service");
const { getUser } = require("../helpers/user");
const methods = {
  async onGetMonster(req, res) {
    try {
      let result = await Service.getMonster(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetLand(req, res) {
    try {
      let result = await Service.getLand(
        Math.floor(parseInt(req.params.id) / 1000),
        Math.floor((parseInt(req.params.id) % 1000) / 100),
        parseInt(req.params.id) % 100
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetItem(req, res) {
    try {
      let result = await Service.getItem(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetTypeItem(req, res) {
    try {
      let result = await Service.getTypeItem();
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
