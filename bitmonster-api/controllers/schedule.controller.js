const stackService = require("../services/stakelog.service");
const poolService = require("../services/pool.service");

const methods = {
  async onScheduleTime() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Update stack monster", new Date());
        const DMS = await stackService.stakeMonster("DMS");
        const RBS = await stackService.stakeMonster("RBS");
        resolve("stack success");
      } catch (error) {
        reject(error);
      }
    });
  },
  async onAddPool(type) {
    return new Promise(async (resolve, reject) => {
      try {
        const DMS = await poolService.addPool(type);
        resolve("add pool 30 day success");
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
