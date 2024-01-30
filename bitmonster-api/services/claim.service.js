const config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods"),
  { getUser } = require("../helpers/user");
const ClaimLog = require("../models/ClaimLog");
const StakeLog = require("../models/StakeLog");
const dayjs = require("dayjs");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.wallet) $or.push({ wallet: { $regex: req.body.wallet } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { no: 1 };
    if (req.body.orderByField && req.body.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { walletAddress } = await getUser(req);

        Promise.all([
          ClaimLog.find().populate({
            path: "stake",
            match: {
              wallet: walletAddress,
            },
          }),
        ])
          .then((result) => {
            const rows = result[0];
            resolve({
              rows: rows,
            });
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  },

  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await ClaimLog.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  findLatestClaim(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { walletAddress } = await getUser(req);
        const tokenArray = ["RBS", "DMS", "DGS"];

        const result = await tokenArray.map(async (item) => {
          const claim = await ClaimLog.findOne({
            wallet: walletAddress,
            token: item,
          })
            .sort({ round: -1 })
            .limit(1);

          const stake = await StakeLog.findOne({
            wallet: walletAddress,
            token: item,
          });

          return {
            token: item,
            claimed_at: claim === null ? 0 : claim.claimed_at,
            reward: stake === null ? 0 : stake.reward,
          };
        });

        const stake = await Promise.all(result);

        resolve(stake);
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },

  claim(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const { token, wallet } = data;

        const stake = await ClaimLog.findOne({ wallet })
          .sort({ round: -1 })
          .limit(1);

        const claim = new ClaimLog({
          token,
          wallet,
          round: stake === null ? 0 : stake.round + 1,
        });
        const result = await claim.save();
        // sigTokenStack

        resolve(result);
      } catch (error) {
        reject(ErrorBadRequest(error));
      }
    });
  },
};

module.exports = { ...methods };
