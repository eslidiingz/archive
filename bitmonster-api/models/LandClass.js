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
      trim: true,
    },
    maxItem: {
      type: Number,
      required: true,
    },
    sellToken: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
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
    maxItem: this.maxItem,
    sellToken: this.sellToken,
    price: this.price,
  };
};

module.exports = mongoose.model("Landclasses", schema);
