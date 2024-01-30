const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    wallet: { type: String, ref: "User" },
    reward: { type: Number, default: 0 },
    token: { type: String, default: "" },
    stakeLog: [
      {
        amount: { type: Number, default: 0 },
        type: { type: String, default: "" },
        class: { type: String, default: "" },
        round: {
          type: Date,
          default: Date.now,
        },
        active: { type: String, default: "Y" },
      },
    ],
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    wallet: this.wallet,
    reward: this.reward,
    token: this.token,
    stakeLog: this.stakeLog,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("StakeLog", schema);
