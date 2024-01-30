const auth = require("../routes/auth"),
    jwt = require("jsonwebtoken");

const getUser = async (req) => {
    const data = await auth.getTokenFromHeader(req);
    return jwt.decode(data);
};

module.exports = { getUser };
