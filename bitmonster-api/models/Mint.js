const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ["create", "wait", "close", "cancel", "user call"],
      required: true,
      default: "create",
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
    data: this.data,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Mint", schema);
