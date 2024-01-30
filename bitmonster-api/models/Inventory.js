const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    assets: [
      {
        assetId: {
          type: String,
          required: true,
          ref: "Asset",
        },
        amount: {
          type: Array,
          required: true,
          default: [],
        },
      },
    ],
    walletAddress: { type: String, ref: "User" },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    id: this._id,
    assets: this.assets,
    walletAddress: this.walletAddress,
  };
};

module.exports = mongoose.model("Inventory", schema);
