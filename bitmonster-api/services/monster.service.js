const Monster = require("../models/Monster");
const config = require("../configs/app");
const { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.name) $or.push({ name: { $regex: req.body.name } });
    if (req.body.rank) $or.push({ rank: { $regex: req.body.rank } });
    if (req.body.type) $or.push({ type: { $regex: req.body.type } });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { no: 1 };
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
          Monster.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Monster.countDocuments(_q.query),
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
        const obj = await Monster.findById(id);
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
        const data = await Monster.find({ default: true });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Monster.find();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
