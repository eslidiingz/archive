const Service = require("../services/asset.service");

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

  async onGetDefault(req, res) {
    try {
      const result = await Service.getDefault();
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onUpdateComma(req, res) {
    try {
      const result = await Service.updateComma(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetAll(req, res) {
    try {
      const result = await Service.getAll();
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
