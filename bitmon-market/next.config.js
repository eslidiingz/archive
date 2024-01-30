const Config = require("dotenv").config({
  path: `./.env`,
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ENVIRONMENT: Config.parsed.ENVIRONMENT || "local",
    CHAIN_ID: Config.parsed.CHAIN_ID || 97,
    APP_DEBUG: Config.parsed.APP_DEBUG || false,
    NFT_SYNC: Config.parsed.NFT_SYNC == "true" ? true : false || false,
  },
};
module.exports = nextConfig;
