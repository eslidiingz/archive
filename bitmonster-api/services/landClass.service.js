// plugins
const config = require("../configs/app");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} = require("../configs/errorMethods");
//model
const LandClass = require("../models/LandClass");
const methods = {
  scopeSearch(req) {
    $or = [];
    // if (req.body.address)
    //   $or.push({ walletAddress: { $regex: req.body.address } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.body.orderByField && req.body.orderBy)
      sort[req.body.orderByField] =
        req.body.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  find(req) {
    const _q = methods.scopeSearch(req);
    console.log("find");
    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([LandClass.find(_q.query)])
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
        const obj = await LandClass.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },

  getClassWithCodeAndIndex(code, index) {
    const classArr = ["Legendary", "Epic", "Rare", "Common"];
    let classResult = 0;
    if (code > 0 && code <= 4) {
      if (index > 0 && index <= 1) {
        classResult = classArr[0];
      } else if (index <= 12) {
        classResult = classArr[2];
      } else if (index <= 36) {
        classResult = classArr[3];
      } else if (index <= 52) {
        classResult = classArr[1];
      }
    } else if (code <= 5) {
      if (index > 0 && index <= 32) {
        classResult = classArr[0];
      }
    }
    return classResult != 0 ? classResult : "Error";
  },
};

module.exports = { ...methods };
