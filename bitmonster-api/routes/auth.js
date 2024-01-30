const jwt = require("express-jwt");
const secret = require("../configs/app").secret;
const allowedOrigins = require("../configs/allowedOrigins");
const requestIp = require("request-ip");
const { decodeKey } = require("../helpers/crypto-js");
const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
// const checkConnection = async (req, res, next) => {
//   const headers = req.headers?.origin;

//   // console.log(headers["postman-token"]);
//   // headers["postman-token"]
//   //   ? res.send({ message: "error" }).status(200)
//   //   : next();

//   // const connection = req.connection;
//   // // console.log(connection);
//   // console.log("remoteAddress",connection["remoteAddress"]);
//   // console.log("remotePort",connection["remotePort"]);
//   // console.log("localAddress",connection["localAddress"]);
//   // console.log("localPort",connection["localPort"]);

//   // if(req.clientIp)
//   console.log("requestIp", requestIp.getClientIp(req));
//   console.log("headers", headers);
//   console.log("allowedOrigins", allowedOrigins);

//   next();
// };

const authKey = async (req, res, next) => {
  if (req.headers["api-key"]) {
    const result = await decodeKey(req.headers["api-key"]);
    if (result) {
      next();
    } else {
      res.error({ message: "api-key Error!!" });
    }
  } else {
    res.error({ message: "require api-key" });
  }
};

const auth = {
  required: jwt({
    secret: secret,
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: secret,
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
  getTokenFromHeader,
  authKey,
};

module.exports = auth;
