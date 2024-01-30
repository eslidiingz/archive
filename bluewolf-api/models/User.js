const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const socialMediaSchema = new mongoose.Schema(
  {
    twitter: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    }
  }
)

const favoriteSchema = new mongoose.Schema(
  {
    tokenid: {
      type: String,
      default: "",
    }
  }
)

const watchlistSchema = new mongoose.Schema(
  {
    tokenid: {
      type: String,
      default: "",
    }
  }
)


const schema = new mongoose.Schema(
  {
    address: {
      type: String,
      index: true,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    socialMedia: socialMediaSchema,
    favorites: [favoriteSchema],
    watchlists: [watchlistSchema]
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    address: this.address,
    username: this.username,
    email: this.email,
    about: this.about,
    socialMedia: this.socialMedia,
    collectionAssets: this.collectionAssets,
    favorites: this.favorites,
    watchlists: this.watchlists,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Users", schema);
