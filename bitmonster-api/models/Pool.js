const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    // type	token	amount	total	updateTime	nextTime
    type: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    updateTime: {
      type: Date,
      default: new Date(),
    },
    nextTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    _id: this._id,
    type: this.type,
    token: this.token,
    amount: this.amount,
    total: this.total,
    updateTime: this.updateTime,
    nextTime: this.nextTime,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Pool", schema);
