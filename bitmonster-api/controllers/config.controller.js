const service = require("../services/config.service");

const methods = {
  async onGetConfig(req, res) {
    try {
      const result = await service.find(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onInsert(req, res) {
    try {
      const result = await service.insert(req.body);
      res.success(result, 201);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
