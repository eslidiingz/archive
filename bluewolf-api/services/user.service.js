const Users = require("../models/User"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.address) $or.push({ address: { $regex: req.query.address } });
    if (req.query.title) $or.push({ title: { $regex: req.query.title } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  findFevByToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.find({
          favorites: {$elemMatch: {tokenid: token}} 
        });
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  findByUsername(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findOne({username: username} 
        );
        resolve(obj);
      } catch (error) {
        reject(ErrorNotFound("username: not found"));
      }
    });
  },


  find(req) {
    const limit = +(req.query.size || config.pageLimit);
    const offset = +(limit * ((req.query.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Users.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Users.countDocuments(_q.query),
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
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Users(data);
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
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Users.updateOne({ _id: id }, data);
        console.log(data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateFav(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Users.updateOne({ _id: id }, { $pull: { favorites: data } });
        console.log(data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Users.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
