const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  config = require("../configs/app");

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      required: true,
    },
    turn: {
      type: Number,
    },
    status: {
      type: String,
      trim: true,
    },
    num: {
      type: Number,
    },
    element: {
      type: String,
      trim: true,
      required: true,
    },
    energy: {
      type: Number,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    POW: {
      type: Number,
      required: true,
    },
    ACC: {
      type: Number,
      required: true,
    },
    CRI: {
      type: Number,
      required: true,
    },
    effect: {
      type: String,
      trim: true,
    },
    effectPercent: {
      type: Number,
      required: true,
    },
    effectTurn: {
      type: Number,
      required: true,
    },
    sound: {
      type: String,
      trim: true,
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
    name: this.name,
    type: this.type,
    turn: this.turn,
    status: this.status,
    num: this.num,
    element: this.element,
    energy: this.energy,
    target: this.target,
    POW: this.POW,
    ACC: this.ACC,
    CRI: this.CRI,
    effect: this.effect,
    effectPercent: this.effectPercent,
    effectTurn: this.effectTurn,
    sound: this.sound,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Skill", schema);
