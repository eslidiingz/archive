const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");
const utils = require("../helpers/utils");

const schema = new mongoose.Schema(
  {
    walletAddress: { type: String, ref: "User" },
    monsters: [
      {
        monsterId: { type: String, ref: "Monster" },
        status: utils.statusMonster,
        processMint: { type: Boolean, default: false },
      },
    ],
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
    monsters: this.monsters,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Farm", schema);
