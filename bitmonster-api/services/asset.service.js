const Asset = require("../models/Asset"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.body.no) $or.push({ no: { $regex: req.body.no } });
    if (req.body.name) $or.push({ name: { $regex: req.body.name } });
    if (req.body.landCode)
      $or.push({ landCode: { $regex: req.body.landCode } });
    if (req.body.type) $or.push({ type: { $regex: req.body.size } });
    if (req.body.size) $or.push({ size: { $regex: req.body.size } });
    if (req.body.num) $or.push({ num: { $regex: req.body.num } });
    if (req.body.status) $or.push({ status: { $regex: req.body.status } });
    if (req.body.time) $or.push({ time: { $regex: req.body.time } });
    const query = $or.length > 0 ? { $or } : {};
    const sort = { no: 1 };
    if (req.body.orderByField && req.body.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const limit = +(req.query.size || config.pageLimit);
    const offset = +(limit * ((req.body.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Asset.find(_q.body).sort(_q.sort).limit(limit).skip(offset),
          Asset.countDocuments(_q.body),
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
        const obj = await Asset.findById(id);
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
        const data = await Asset.find({ default: true });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },

  updateComma(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const limit = +(req.query.size || config.pageLimit);
        const offset = +(limit * ((req.query.page || 1) - 1));
        const _q = methods.scopeSearch(req);
        Promise.all([Asset.find(_q.query), Asset.countDocuments(_q.query)])
          .then((result) => {
            const rows = result[0],
              count = result[1];

            rows.map(async (doc) => {
              let str = doc.landCode;
              if (str != null) {
                arr = str[0].split(",");
                console.log(doc);
                await Asset.updateOne({ _id: doc._id }, { landCode: arr });
              }
            });
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
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Asset.find();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
