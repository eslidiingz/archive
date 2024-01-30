const Service = require("../services/pool.service");
const { getUser } = require("../helpers/user");
const methods = {
  async onInitPool(req, res) {
    try {
      const result = await Service.initPool();

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onAddPool(req, res) {
    try {
      const result = await Service.addPool(req.body.type);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetPool(req, res) {
    try {
      const result = await Service.getPool();

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
