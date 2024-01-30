const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");


const portfolioSchema = new mongoose.Schema({
  value: {
    type: String,
  }
});

const registerSchema = new mongoose.Schema({
  userName: { type: String },
  email: { type: String },
  about: { type: String },
  portfolio: [portfolioSchema]
});

const schema = new mongoose.Schema(
  {
    address: {
      type: String,
      index: true,
      required: true,
    },
    roles: {
      type: String,
    },
    flag: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    register: {
      type: registerSchema
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    address: this.address,
    roles: this.roles,
    register: this.register,
    flag: this.flag,
    image: this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Whitelists", schema);
