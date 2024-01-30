const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const utils = require("../helpers/utils");

const schema = new mongoose.Schema(
  {
    walletAddress: { type: String, require: true, ref: "User" },
    landClass: { type: String, require: true, ref: "Landclasses" },
    landCode: { type: String, require: true, ref: "Landcodes" },
    zone: { type: Number, require: true },
    index: { type: Number, require: true },
    active: { type: Boolean, default: false },
    activeTime: { type: Date, default: null },
    assets: [
      {
        assetId: { type: String, ref: "Asset" },
        assignTime: {
          type: Date,
          default: Date.now,
        },
        storage: {
          amount: { type: Number, default: 0 },
          updateTime: {
            type: Date,
            default: Date.now,
          },
          nextTime: { type: Date },
        },
        coordinate: {
          x: { type: Number, require: true },
          y: { type: Number, require: true },
        },
        default: { type: Boolean, required: true },
      },
    ],
    monsters: [
      {
        monsterId: { type: String, ref: "Monster" },
        status: utils.statusMonster,
        assignTime: {
          type: Date,
          default: Date.now,
        },
        updateTime: {
          type: Date,
          default: Date.now,
        },
        nextTime: { type: Date },
      },
    ],
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
    processMint: { type: Boolean, default: false },
    default: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    id: this._id,
    walletAddress: this.walletAddress,
    landClass: this.landClass,
    landCode: this.landCode,
    zone: this.zone,
    index: this.index,
    active: this.active,
    activeTime: this.activeTime,
    assets: this.assets,
    monsters: this.monsters,
    ranking: this.ranking,
    energy: this.energy,
    processMint: this.processMint,
    default: this.default,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

schema.pre("find", function (next) {
  this.populate("landClass");
  this.populate("landCode");
  next();
});
schema.pre("findOne", function (next) {
  this.populate("landClass");
  this.populate("landCode");
  next();
});
// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("UserLand", schema);
