const Land = require("../models/Land"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.no) $or.push({ no: { $regex: req.body.no } });
    const query = $or.length > 0 ? { $or } : {};
    const sort = req.body.sort ? req.body.sort : { createdAt: -1 };
    return { query: query, sort: sort };
  },

  find(req) {
    const limit = +(req.body.size || config.pageLimit);
    const offset = +(limit * ((req.body.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Land.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Land.countDocuments(_q.query),
        ])
          .then((result) => {
            const rows = result[0],
              count = result[1];
            resolve({
              total: count,
              lastPage: Math.ceil(count / limit),
              currPage: +req.query.page || 1,
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
        const obj = await Land.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  getDefault() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Land.find();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
