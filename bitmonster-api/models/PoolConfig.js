const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
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
    day: {
      type: Number,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
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
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Poolconfigs", schema);
