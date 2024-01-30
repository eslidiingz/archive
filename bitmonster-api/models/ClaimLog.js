const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");
const dayjs = require("dayjs");

const schema = new mongoose.Schema(
  {
    round: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: "",
    },
    wallet: {
      type: String,
      default: "",
    },
    claimed_at: {
      type: Date,
      default: Date.now,
    },
    nextround_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    stake: this.stake,
    claimed_at: this.claimed_at,
    nextround_at: this.nextround_at,
    round: this.round,
    token: this.token,
    wallet: this.wallet,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  this.nextround_at = date;
  next();
});

module.exports = mongoose.model("ClaimLog", schema);
