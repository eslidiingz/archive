const { check } = require("express-validator");
const { ethers } = require("ethers");
const User = require("../models/User");

module.exports = {
  verifyWallet: [
    check("reports")
      .custom((value) => {
        return value.length == 2 ? true : false;
      })
      .withMessage("require 2 wallet"),

    check("reports")
      .custom((value) => {
        let status = true;
        for (const element of value) {
          ethers.utils.isAddress(element.walletAddress) ? "" : (status = false);
        }
        return status;
      })
      .withMessage("some address incorrect"),

    check("reports")
      .custom((value) => {
        try {
          return value[0].walletAddress != value[1].walletAddress;
        } catch (e) {
          return e;
        }
      })
      .withMessage("2 address is same"),

    check("reports").custom((value) => {
      try {
        return User.findOne({
          walletAddress: value[0].walletAddress,
        }).then((user) => {
          return user ? "" : Promise.reject("user one not found");
        });
      } catch (e) {
        return e;
      }
    }),

    check("reports").custom((value) => {
      try {
        return User.findOne({
          walletAddress: value[1].walletAddress,
        }).then((user) => {
          return user ? "" : Promise.reject("user two not found");
        });
      } catch (e) {
        return e;
      }
    }),
  ],
};
