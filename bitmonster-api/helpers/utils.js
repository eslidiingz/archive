const moment = require("moment-timezone");
const Habit = require("../models/Habit");
const dateTH = moment.tz(Date.now(), "Asia/Bangkok");
const UserLand = require("../models/UserLand");
const objToArray = (obj) =>
  Object.keys(obj).map((key) => [Number(key), obj[key]]);

const statusMonster = {
  life: { type: Number },
  age: { type: Number, default: 0 },
  lv: { type: Number, default: 1 },
  dead: { type: Boolean, default: false },
  emotion: { type: Number, default: 0 },
  habit: {
    amount: { type: Number },
    updateTime: {
      type: Date,
      default: null,
    },
    nextTime: { type: Date, default: null },
  },
  evo: {
    type: Number,
    default: 0,
  },
  default: { type: Boolean, default: true },
};

const statusDataMonster = (element, habitTime = null) => {
  let data = {
    life: element.life,
    age: element.age,
    lv: 1,
    habit: {
      amount: element.habit.amount ? element.habit.amount : element.habit,
    },
    evo: element.evo ? element.evo : 0,
    default: element.default,
  };
  if (habitTime) {
    data.habit.nextTime = habitTime.nextTime;
    data.habit.updateTime = habitTime.updateTime;
  }
  return data;
};

// monster
const getHabitMonster = async (monsterRank) => {
  const habitTime = await Habit.find({});
  const habitFilter = habitTime.filter(
    (elementHabitTime) =>
      elementHabitTime.rank.toLowerCase() == monsterRank.toLowerCase()
  );
  return habitFilter.length > 0 ? habitFilter[0] : null;
};

const convertArrayToNumber = async (data) => {
  try {
    if (typeof data == "number") {
      return data;
    } else if (Array.isArray(data)) {
      if (!data.length) return 0;
      const res = data.reduce((sum, val) => sum + val, 0);
      if (typeof res != "number")
        throw new Error(
          "The parameter data in array must be of type number only."
        );
      return parseInt(res);
    } else {
      throw new Error(
        "The parameter data must be of type number or array only."
      );
    }
  } catch (err) {
    return err;
  }
};

const convertNumberToArrayItemBoxMax = async ({ valAmount, valAmountMax }) => {
  try {
    const res = [];
    if (typeof valAmountMax != "number" || valAmountMax < 0)
      throw new Error(
        "The parameter valAmountMax must be of type number only."
      );

    if (typeof valAmount != "number")
      throw new Error("The parameter valAmount must be of type number only.");

    const mitiAmount = Math.ceil(valAmount / valAmountMax);

    for (let i = 0; i < mitiAmount; i++) {
      if (valAmount > valAmountMax) res.push(parseInt(valAmountMax));
      else res.push(parseInt(valAmount));
      valAmount = valAmount - valAmountMax;
    }

    return res;
  } catch (err) {
    return err;
  }
};

const mapInventoryAmountListToUpdateByType = async ({
  paramsAmount,
  valAmountNum,
  valTypeAmount,
  valAmountBoxMax,
}) => {
  try {
    const res = [];
    let countNum = 0;
    let plusStack = [];
    let checkInsert = 0;

    if (!Array.isArray(paramsAmount))
      throw new Error("paramsAmount want to type array only.");
    if (typeof valAmountNum != "number")
      throw new Error("valAmountNum want to type number only.");
    if (typeof valTypeAmount != "boolean")
      throw new Error("valTypeAmount want to type boolean only.");
    if (typeof valAmountBoxMax != "number")
      throw new Error("valAmountBoxMax want to type number only.");

    for (let obj of paramsAmount) {
      if (valTypeAmount === obj.default) {
        countNum = await convertArrayToNumber(obj.stack);
        if (countNum instanceof Error) throw new Error(countNum.message);

        plusStack = await convertNumberToArrayItemBoxMax({
          valAmount: valAmountNum + countNum,
          valAmountMax: valAmountBoxMax,
        });
        if (plusStack instanceof Error)
          throw new Error(`at update object ${plusStack.message}`);
        checkInsert++;
      } else {
        plusStack = obj.stack;
      }

      res.push({
        stack: plusStack,
        default: obj.default,
      });
    }

    //ตรวจสอบว่า ใน Amount ไม่มี type default อยู่ให้เพิ่มลงไป
    if (!checkInsert) {
      plusStack = await convertNumberToArrayItemBoxMax({
        valAmount: valAmountNum,
        valAmountMax: valAmountBoxMax,
      });
      if (plusStack instanceof Error)
        throw new Error(`at insert object ${plusStack.message}`);

      res.push({
        stack: plusStack,
        default: valTypeAmount,
      });
    }

    return res;
  } catch (err) {
    return err;
  }
};

const providerUrl = {
  97: "https://data-seed-prebsc-2-s1.binance.org:8545/",
  // 97: "https://nd-000-791-964.p2pify.com/9d72fc41e88bfa945e49d73b3645fe81",
  56: "https://bsc-dataseed.binance.org/",
  80001: "https://nd-851-869-734.p2pify.com/f403df1ee9cec1bab45a5302e359ba3e",
};

const chainId = process.env.CHAIN_ID ? process.env.CHAIN_ID : 97;
const useProviderUrl = providerUrl[chainId];

module.exports = {
  useProviderUrl,
  objToArray,
  dateTH,
  statusMonster,
  statusDataMonster,
  getHabitMonster,
  convertArrayToNumber,
  convertNumberToArrayItemBoxMax,
  mapInventoryAmountListToUpdateByType,
};
