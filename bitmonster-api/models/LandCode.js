const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    land: {
      type: String,
      trim: true,
    },
    indexChar: {
      type: String,
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
    land: this.land,
    indexChar: this.indexChar,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Landcodes", schema);
