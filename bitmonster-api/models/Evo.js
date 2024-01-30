const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    evo: {
      type: Number,
      index: true,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
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
    evo: this.evo,
    token: this.token,
    amount: this.amount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Evo", schema);
