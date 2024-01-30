const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    rank: {
      type: String,
      index: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    num: { type: Number, required: true, default: 1 },
    time: { type: Number, required: true, default: 24 },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    id: this._id,
    rank: this.rank,
    num: this.num,
    time: this.time,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Habit", schema);
