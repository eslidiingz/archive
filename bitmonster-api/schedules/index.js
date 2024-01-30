const controller = require("../controllers/schedule.controller");
const cron = require("node-cron");
const { job_schedule } = require("../configs/app");

cron.schedule(job_schedule, async () => {
  const status = await controller.onScheduleTime();
  console.log(status);
});

// add pool auto every 30 day
// clear stack all user
cron.schedule("0 12 */30 * *", async () => {
  const status = await controller.onAddPool(30);
  console.log(status);
});

// add pool auto every 7 day
cron.schedule("0 12 */7 * *", async () => {
  const status = await controller.onAddPool(7);
  console.log(status);
});
