const Service = require("../services/landCode.service");
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
};

module.exports = { ...methods };
