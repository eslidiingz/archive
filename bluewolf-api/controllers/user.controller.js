const Service = require("../services/user.service");

const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetFevByToken(req, res) {
    try {
      const result = await Service.findFevByToken(req.params.token);
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

  async onGetFev(req, res) {
    try {
      const result = await Service.findFevByToken(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onInsert(req, res) {
    console.log(req.body);
    try {
      const result = await Service.insert(req.body);
      res.success(result, 201);
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
  async onUpdateFav(req, res) {
    try {
      const result = await Service.updateFav(req.params.id, req.body);
      res.success(result);
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
};

module.exports = { ...methods };
