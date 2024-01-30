const Service = require("../services/skill.service");
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
};

module.exports = { ...methods };
