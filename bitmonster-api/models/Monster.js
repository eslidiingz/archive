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
    rank: { type: String, required: true },
    type: { type: String, required: true },
    power: { type: Number, required: true },
    powerRed: { type: Number, required: true },
    hp: { type: Number, required: true },
    POW: { type: Number, required: true },
    DEF: { type: Number, required: true },
    ACC: { type: Number, required: true },
    SPD: { type: Number, required: true },
    CRI: { type: Number, required: true },
    HPxLv: { type: Number, required: true },
    POWxLv: { type: Number, required: true },
    DEFxLv: { type: Number, required: true },
    ACCxLv: { type: Number, required: true },
    SPDxLv: { type: Number, required: true },
    CRIxLv: { type: Number, required: true },
    SK1: { type: String, required: true, ref: "Skill" },
    SK2: { type: String, required: true, ref: "Skill" },
    SK3: { type: String, required: true, ref: "Skill" },
    SK4: { type: String, required: true, ref: "Skill" },
    life: { type: Number, required: true },
    food: { type: Number, required: true },
    breed: { type: Number, required: true },
    emotion: { type: Number, required: true },
    habit: { type: Number, required: true },
    age: { type: Number, required: true },
    unlock: { type: Number, required: true },
    evolve2: { type: Number, required: true },
    evolve3: { type: Number, required: true },
    stone: { type: String },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    monUI: { type: String, required: true },
    soundMon: { type: String },
    miniPic: { type: String, required: true },
    default: { type: Boolean, default: true },
    sellToken: { type: String },
    price: { type: Number, default: 0 },
    cardImage: { type: String, required: true },
    class: { type: String, required: true },
  },
  { timestamps: true }
);
// schema.virtual("refSkill01", {
//   ref: "Skill",
//   localField: "SK1",
//   foreignField: "no",
// });
// schema.virtual("refSkill02", {
//   ref: "Skill",
//   localField: "SK2",
//   foreignField: "no",
// });
// schema.virtual("refSkill03", {
//   ref: "Skill",
//   localField: "SK3",
//   foreignField: "no",
// });
// schema.virtual("refSkill04", {
//   ref: "Skill",
//   localField: "SK4",
//   foreignField: "no",
// });

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator, { status: 400 });

// Custom JSON Response
schema.methods.toJSON = function () {
  return {
    id: this._id,
    no: this.no,
    name: this.name,
    rank: this.rank,
    type: this.type,
    power: this.power,
    powerRed: this.powerRed,
    hp: this.hp,
    POW: this.POW,
    DEF: this.DEF,
    ACC: this.ACC,
    SPD: this.SPD,
    CRI: this.CRI,
    HPxLv: this.HPxLv,
    POWxLv: this.POWxLv,
    DEFxLv: this.DEFxLv,
    ACCxLv: this.ACCxLv,
    SPDxLv: this.SPDxLv,
    CRIxLv: this.CRIxLv,
    SK1: this.SK1,
    SK2: this.SK2,
    SK3: this.SK3,
    SK4: this.SK4,
    life: this.life,
    food: this.food,
    breed: this.breed,
    emotion: this.emotion,
    habit: this.habit,
    age: this.age,
    unlock: this.unlock,
    evolve2: this.evolve2,
    evolve3: this.evolve3,
    stone: this.stone,
    height: this.height,
    weight: this.weight,
    monUI: this.monUI,
    soundMon: this.soundMon,
    miniPic: this.miniPic,
    default: this.default,
    sellToken: this.sellToken,
    price: this.price,
    cardImage: this.cardImage,
    class: this.class,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};
schema.pre("find", function (next) {
  this.populate("SK1");
  this.populate("SK2");
  this.populate("SK3");
  this.populate("SK4");
  next();
});

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Monster", schema);
