const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    creator: {
      type: String,
    },
    contractAddress:{
      type: String,
    },
    Nftprice:{
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    Orderprice:{
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    marketStatus:{
      type: String,
      default: "avialable",
    },
    token: {
      type: String,
    },
    hash: {
      type: String,
      default: "",
    },
    metadata: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    verify: {
      type: String,
      default: "",
    },
    remark: {
      type: String,
      default: "",
    },
    verifyId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    address: this.address,
    creator: this.creator,
    contractAddress: this.contractAddress,
    Nftprice: this.Nftprice,
    Orderprice: this.Orderprice,
    marketStatus: this.marketStatus,
    token: this.token,
    hash: this.hash,
    metadata: this.metadata,
    image: this.image,
    verify: this.verify,
    remark: this.remark,
    verifyId: this.verifyId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Assets", schema);
