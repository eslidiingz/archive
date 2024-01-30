const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      index: true,
      required: true,
    },
    keys: [
      {
        key: {
          required: true,
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
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
    keys: this.keys,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("KeyApi", schema);
