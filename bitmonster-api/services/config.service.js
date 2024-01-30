const config = require("../configs/app");
const Config = require("../models/Config");

const methods = {
  scopeSearch(req) {
    $and = [];
    if (req.query.key) $and.push({ key: { $regex: req.query.key } });
    if (req.query.type) $and.push({ type: { $regex: req.query.type } });

    const query = $and.length > 0 ? { $and } : {};

    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([Config.find(_q.query)])
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
        const obj = await Config.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Config(data);
        const inserted = await obj.save();
        resolve(inserted);
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Config.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Config.updateOne({ _id: id }, data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },

  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Config.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Config.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
