const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    key: { type: String },
    value: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator, { status: 400 });

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Config", schema);
