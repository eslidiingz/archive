const Config = require("dotenv").config({
  path: `./.env.${process.env.ENVIRONMENT}`,
});
// console.log("env", process.env);
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_API_URL: Config.parsed.BASE_API_URL,
    ENVIRONMENT: Config.parsed.ENVIRONMENT || "local",
    LOADER_URL: Config.parsed.LOADER_URL,
    DATA_URL: Config.parsed.DATA_URL,
    FRAMEWORK_URL: Config.parsed.FRAMEWORK_URL,
    CODE_URL: Config.parsed.CODE_URL,
    CONTRACT_GAME: Config.parsed.CONTRACT_GAME,
    CHAIN_ID: Config.parsed.CHAIN_ID,
  },
};

module.exports = nextConfig;
