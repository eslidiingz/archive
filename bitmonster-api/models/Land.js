const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    landClass: {
      type: String,
      required: true,
      ref: "LandClass",
    },
    landCode: {
      type: String,
      required: true,
      ref: "LandCode",
    },
    zone: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
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
    landClass: this.landClass,
    landCode: this.landCode,
    zone: this.zone,
    index: this.index,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Land", schema);
