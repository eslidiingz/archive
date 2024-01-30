const { check } = require("express-validator");
const { ethers } = require("ethers");

module.exports = {
  register: [
    check("walletAddress")
      .custom((value) => {
        return ethers.utils.isAddress(value);
      })
      .withMessage("incorrect address"),
  ],
  updateName: [
    check("name").isLength({ min: 3 }).withMessage("Minimal 3 character"),
    check("name").isLength({ max: 10 }).withMessage("Maximum 10 character"),
  ],
};
