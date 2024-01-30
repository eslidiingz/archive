const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["wait", "close"],
      default: "wait",
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
    walletAddress: this.walletAddress,
    hash: this.hash,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Burn", schema);
