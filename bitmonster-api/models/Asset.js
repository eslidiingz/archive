const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    no: {
      type: String,
      index: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: false,
    },
    name: { type: String, required: true },
    category: { type: String, require: true },
    landCode: [{ type: String }],
    type: { type: String },
    size: { type: Number },
    num: { type: Number },
    status: { type: String },
    time: { type: Number },
    tokenActive: { type: Boolean, default: false },
    tokenType: { type: String, default: null },
    default: { type: Boolean, default: false },
    defaultAmount: { type: Number, default: 0 },
    sellToken: { type: String },
    price: { type: Number, default: 0 },
    cardImage: { type: String, required: true },
    class: { type: String, required: true },
    add: { type: String },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    id: this._id,
    no: this.no,
    category: this.category,
    name: this.name,
    landCode: this.landCode,
    type: this.type,
    size: this.size,
    num: this.num,
    status: this.status,
    time: this.time,
    tokenActive: this.tokenActive,
    tokenType: this.tokenType,
    default: this.default,
    defaultAmount: this.defaultAmount,
    sellToken: this.sellToken,
    price: this.price,
    cardImage: this.cardImage,
    class: this.class,
    add: this.add,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Asset", schema);
