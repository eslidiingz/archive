const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    wallet: {
      type: String,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
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
    date: this.date,
    type: this.type,
    wallet: this.wallet,
    token: this.token,
    amount: this.amount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Poollogs", schema);
