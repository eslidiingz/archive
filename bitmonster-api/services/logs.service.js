// plugins
const config = require("../configs/app");
const jwt = require("jsonwebtoken");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.address)
      $or.push({ walletAddress: { $regex: req.query.address } });

    const query = $or.length > 0 ? { $or } : {};
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
        Promise.all([User.find(_q.query)])
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
        const obj = await User.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
};

module.exports = { ...methods };
