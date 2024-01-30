const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      index: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: false,
    },
    name: {
      type: String,
      trim: true,
    },
    ranking: {
      week: {
        score: { type: Number, default: 0 },
        updateTime: { type: Date, default: null },
      }, // 7 day
      season: {
        score: { type: Number, default: 0 },
        updateTime: { type: Date, default: null },
      }, // 90 day
      collect: {
        score: { type: Number, default: 0 },
        updateTime: { type: Date, default: null },
      }, // all
    },
    energy: {
      amount: { type: Number, default: 20 },
      nextTime: {
        type: Date,
        default: null,
      },
      updateTime: {
        type: Date,
        default: null,
      },
    },
    mockToken: {
      RBS: { type: Number, default: 0 },
      DMS: { type: Number, default: 0 },
      DGS: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

// Generate JWT
schema.methods.generateJWT = function (obj) {
  let today = new Date(),
    exp = new Date(today);
  exp.setDate(today.getDate() + config.token_exp_days || 1);
  // exp.setMinutes(today.getMinutes() + 30);

  return jwt.sign(
    {
      id: this._id,
      walletAddress: this.walletAddress,
      exp: parseInt(exp.getTime() / 1000),
    },
    config.secret
  );
};

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    walletAddress: this.walletAddress,
    ranking: this.ranking,
    energy: this.energy,
    mockToken: this.mockToken,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("User", schema);
