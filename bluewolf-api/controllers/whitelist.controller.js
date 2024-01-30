const Service = require("../services/whitelist.service");

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
  async onGetByUsername(req, res) {
    try {
      const result = await Service.findByUsername(req.params.username);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onInsert(req, res) {
    try {
      const { id } = req.file;
      req.body.register = JSON.parse(req.body.register);
      const {address, roles, flag, register} = req.body;

      const data = { address, roles, flag, image: id, register };
      const result = await Service.insert(data);
      res.success(result, 201);
    } catch (error) {
      res.error(error);
    }
  },
  async onDelete(req, res) {
    try {
      await Service.delete(req.params.id);
      res.success("success", 204);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdate(req, res) {
    try {
      const result = await Service.update(req.params.id, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onRegister(req, res) {
    try {
      const result = await Service.register(req.params.address, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };