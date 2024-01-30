const jwt = require("jsonwebtoken"),
  secret = require("../configs/app").secret;

const methods = {
  verifyPasscodeToken(req) {
    try {
      if (req?.headers?.["passcode-authorization"]) {
        return jwt.verify(req.headers["passcode-authorization"], secret);
      }
      return null;
    } catch {
      return null;
    }
  },
};

module.exports = { ...methods };
