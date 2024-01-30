const Service = require("../services/sig.service");
const { getUser } = require("../helpers/user");
const methods = {
  async onSigMonster(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.sigMonster(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateSigMonster(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.updateSigMonster(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onConfirmSigMonster(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.confirmSigMonster(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onSigLand(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.sigLand(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateSigLand(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.updateSigLand(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onConfirmSigLand(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.confirmSigLand(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onSigItem(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.sigItem(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateSigItem(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.updateSigItem(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onConfirmSigItem(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.confirmSigItem(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onSigToken(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.sigTokenStack(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateSigToken(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.updateSigToken(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onConfirmSigTokenStack(req, res) {
    const user = await getUser(req);
    try {
      const result = await Service.confirmSigTokenStack(
        user.walletAddress,
        req
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
