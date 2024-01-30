const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    endTime: {
      type: Date,
      require: true,
    },
    type: {
      type: String,
      enum: ["week", "season"],
    },
    count: {
      type: Number,
      default: 0,
    },
    list: [
      {
        userId: {
          type: String,
          ref: "User",
        },
        ranking: {
          type: Number,
          default: 0,
        },
        score: {
          type: Number,
          default: 0,
        },
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
    endTime: this._endTime,
    type: this._type,
    count: this._endTime,
    list: this._list,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Ranking", schema);
