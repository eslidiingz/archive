const Service = require("../services/evo.service");
const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
