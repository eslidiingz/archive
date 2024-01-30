const Ranking = require("../models/Ranking");
const User = require("../models/User");
const config = require("../configs/app");
const { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");
const serviceUser = require("./user.service");
const dataSortWeek = {
  "ranking.week.score": -1,
  "ranking.week.updateTime": 1,
};
const dataSortSeason = {
  "ranking.season.score": -1,
  "ranking.season.updateTime": 1,
};
const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.title) $or.push({ title: { $regex: req.body.title } });
    if (req.body.description)
      $or.push({ description: { $regex: req.body.description } });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.body.orderByField && req.body.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const limit = +(req.body.size || config.pageLimit);
    const offset = +(limit * ((req.body.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Ranking.find(_q.query)
            .sort(_q.sort)
            .limit(limit)
            .skip(offset)
            .populate("author"),
          Ranking.countDocuments(_q.query),
        ])
          .then((result) => {
            const rows = result[0],
              count = result[1];
            resolve({
              total: count,
              lastPage: Math.ceil(count / limit),
              currPage: +req.body.page || 1,
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
        const obj = await Ranking.findById(id).populate("author");
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  startMatch(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let walletAddress = [];
        for (const element of req.body.reports) {
          walletAddress.push(element.walletAddress);
          await serviceUser.updateEnergy(element.walletAddress, -1);
        }
        const data = await User.find({
          walletAddress: { $in: walletAddress },
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
  endMatch(req) {
    const dateNow = new Date();
    return new Promise(async (resolve, reject) => {
      try {
        let walletAddress = [];
        for (const element of req.body.reports) {
          walletAddress.push(element.walletAddress);
          const obj = await User.findOne({
            walletAddress: element.walletAddress,
          });
          await User.updateOne(
            { walletAddress: element.walletAddress },
            {
              $set: {
                ranking: {
                  week: {
                    score:
                      obj.ranking.week.score + element.score >= 0
                        ? obj.ranking.week.score + element.score
                        : 0,
                    updateTime: dateNow,
                  },
                  season: {
                    score:
                      obj.ranking.season.score + element.score >= 0
                        ? obj.ranking.season.score + element.score
                        : 0,
                    updateTime: dateNow,
                  },
                  collect: {
                    score:
                      obj.ranking.collect.score + element.score >= 0
                        ? obj.ranking.collect.score + element.score
                        : 0,
                    updateTime: dateNow,
                  },
                },
              },
            }
          );
        }
        const data = await User.find({
          walletAddress: { $in: walletAddress },
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
  rankingNow(type, userAddress = null) {
    let data = {
      list: [],
      me: null,
    };
    let user = [];
    const limit = 100;
    return new Promise(async (resolve, reject) => {
      try {
        if (type == "week" || type == "season") {
          data.list =
            type == "week"
              ? await User.aggregate([
                  {
                    $match: {
                      "ranking.week.updateTime": { $ne: null },
                    },
                  },
                  {
                    $sort: dataSortWeek,
                  },
                  { $limit: limit },
                  {
                    $project: {
                      _id: 0,
                      userId: "$_id",
                      name: "$name",
                      score: "$ranking.week.score",
                      walletAddress: "$walletAddress",
                      updateTime: "$ranking.week.updateTime",
                    },
                  },
                ])
              : await User.aggregate([
                  {
                    $match: {
                      "ranking.season.updateTime": { $ne: null },
                    },
                  },
                  {
                    $sort: dataSortSeason,
                  },
                  { $limit: limit },
                  {
                    $project: {
                      _id: 0,
                      userId: "$_id",
                      name: "$name",
                      score: "$ranking.season.score",
                      walletAddress: "$walletAddress",
                      updateTime: "$ranking.season.updateTime",
                    },
                  },
                ]);
          user =
            userAddress != null
              ? type == "week"
                ? await User.find({
                    "ranking.week.updateTime": { $ne: null },
                  }).sort(dataSortWeek)
                : await User.find({
                    "ranking.season.updateTime": { $ne: null },
                  }).sort(dataSortSeason)
              : [];
          data.me =
            userAddress != null
              ? {
                  no:
                    user.findIndex(
                      (element) => element.walletAddress == userAddress
                    ) + 1,
                }
              : {};
          resolve(data);
        } else {
          reject(ErrorNotFound("type not found"));
        }
      } catch (error) {
        reject(ErrorNotFound(error));
      }
    });
  },
  // testInsert() {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const round = await Ranking.find({ type: "week" }).count((err, res) => {
  //         new Promise(async (resolve, reject) => {
  //           resolve(res);
  //         });
  //       });

  //       console.log("dataSort", dataSort);
  //       const dataFind = await User.find({});
  //       const dataUser = await User.aggregate([
  //         {
  //           $match: {
  //             "ranking.week.updateTime": { $ne: null },
  //           },
  //         },
  //         {
  //           $sort: dataSort,
  //         },

  //         // {
  //         //   $setWindowFields: {
  //         //     sortBy: {
  //         //       "ranking.week.updateTime": 1,
  //         //       "ranking.week.score": -1,
  //         //     },
  //         //     output: { rowNumber: { $documentNumber: {} } },
  //         //   },
  //         // },
  //         {
  //           $project: {
  //             _id: 0,
  //             userId: "$_id",
  //             score: "$ranking.week.score",
  //             ranking: "$rowNumber",
  //             walletAddress: "$walletAddress",
  //             updateTime: "$ranking.week.updateTime",
  //           },
  //         },
  //       ]);
  //       // console.log(round);
  //       const dataInsert = {
  //         endTime: new Date(),
  //         type: "week",
  //         count: round + 1,
  //         list: dataUser,
  //       };
  //       await new Ranking(dataInsert).save();
  //       // resolve(await Ranking.find({}));
  //       // resolve(dataInsert);
  //       resolve(dataUser);
  //     } catch (error) {
  //       reject(ErrorNotFound(error));
  //     }
  //   });
  // },
};

module.exports = { ...methods };
