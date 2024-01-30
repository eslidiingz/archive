const Service = require("../services/userLand.service");
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

  async onGetById(req, res) {
    try {
      const result = await Service.findById(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onBuyLand(req, res) {
    try {
      const result = await Service.buyLand(req.body.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onGetWithOwner(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.getWithOwner(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateActive(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.updateActive(
        user.walletAddress,
        req.body.id,
        req.body.active
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onAssignAsset(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.assignAsset(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onRemoveAsset(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.removeAsset(
        user.walletAddress,
        req.body.id,
        req.body.assignId
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onResetAsset(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.resetAsset(user.walletAddress, req.body.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onAssignMonster(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.assignMonster(user.walletAddress, req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onRemoveMonster(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.removeMonster(
        user.walletAddress,
        req.body.id,
        req.body.assignId
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onUpdateInLands(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.updateInLands(user.walletAddress);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onIncrementAsset(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.incrementAsset(
        user.walletAddress,
        req.body.id
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onMonsterUpdate(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.monsterUpdate(
        user.walletAddress,
        req.body.id
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onHabitUpdate(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.decrementHabit(
        user.walletAddress,
        req.body.id
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onResetLand(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.resetLand(user.walletAddress, req.body.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onEvoMonster(req, res) {
    try {
      const user = await getUser(req);
      const result = await Service.evoMonster(
        user.walletAddress,
        req.body.id,
        req.body.monsterIdInLand
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
