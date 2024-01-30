const Service = require("../services/monster.service");

const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetAllMonster(req, res) {
    try {
      const result = await Service.getAll();
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

  async onInsert(req, res) {
    try {
      const result = await Service.insert(req.body);
      res.success(result, 201);
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
};

module.exports = { ...methods };
