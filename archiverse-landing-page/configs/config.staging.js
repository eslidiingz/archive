const ConfigStaging = {
  CHAIN_ID: 1246,
  RPC: "https://rpc.omplatform.com",

  BSC_CHAIN_ID: 97,
  BSC_EXPLORER: "https://testnet.bscscan.com",
  BSC_RPC: "https://nd-137-006-723.p2pify.com/27daa7016828e3e8562a9a49969d54e9",
  BSC_BUSD_CA: "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb",

  EXPLORER: "https://evm-explorer.omplatform.com",
  SETTER_WALLET:
    "6a4e6542a16058031948e10d833df28b41b0ed5ffc39c3fdac30d778f694131b",
  SALT_API_KEY: "ZV$tz4qbu^sEBhSk",

  BUSD_CA: "0xaa711E48BA42D7117E63CfbdA78abA34203a138A",
  ASSET_CA: "0xFD701E1Bb5FE3b9e6066eA4af0346dD96E63408b",
  MARKETPLACE_CA: "0x7e4421332e17f66D8B215a4db1d247f1A277cceB",
  LAUNCHPAD_CA: "0xd330EC5c33733A6C88b410f10227796F551b5b64",
  WRAPPER_TOKEN_CA: "0xC0cE371634694B95487C3d9A1261aA9c05725af1", // verify native token
  WHITELIST_TOKEN_CA: "0x136b56c2F69933DfEfC673d734c6426df562f9F3",

  ASSET_ABI: require("../abis/staging/Asset.json"),
  MARKETPLACE_ABI: require("../abis/staging/Marketplace.json"),
  LAUNCHPAD_ABI: require("../abis/staging/LaunchPad.json"),
  ERC20_ABI: require("../abis/staging/Erc20.json"),
  MULTICALL_ABI: require("../abis/staging/Multicall.json"),
  WRAPPER_ABI: require("../abis/staging/WrapperToken.json"),
  WHITELIST_ABI: require("../abis/staging/WhitelistToken.json"),

  MARKETPLACE_BLOCK_START: 5109524,
  ASSET_BLOCK_START: 5109526,
  UNLIMIT_ALLOWANCE: "1000000000000000000000000000",

  GET_FILE_URI: "https://api.swaple.multiverseexpert.com/cdn/file",
  FILE_SERVER_URI: "https://api.swaple.multiverseexpert.com/upload", // image
  FILE3D_SERVER_URI: "https://api.swaple.multiverseexpert.com/upload-bundle", // 3d
  METADATA_SERVER_URI:
    "https://api.swaple.multiverseexpert.com/upload-metadata",
  REST_URI: "",
  GQL_URI: "https://api.swaple.multiverseexpert.com/graphql",
  GQL_PASS: "dev@1Mex",
  COVEST_API_URI: "https://api.covest.finance/api",
  ORACLE_API_URI: "https://api.swaple.app",

  BRIDGE_BSC_CA: "0xF14fD69890bD00A1F5B7f6351e4D4dD7C4b27d37",
  BRIDGE_OM_CA: "0x625fDFFDF2E5516070f42cBf05e6B0B4146B4e94",
  BRIDGE_ABI: require("../abis/staging/Bridge.json"),

  BRIDGE_API_URL: "https://api.swaple.app",
  BRIDGE_API_KEY: "1234",
  BRIDGE_ENCRYPT_KEY: "abcdefghijklmnopqrstuvwxyz012345",

  // ORACLE_API_URI: "http://localhost:3100"

  OM_TOPUP_API_KEY: "daffa4eb-3c0c-4e93-8896-13a3d6ba8a63",
  OM_TOPUP_API_URL: "https://ccw-api.leafbot.io/webhook/wallet-topup-request",

  CMS_API: "https://api.swaple.multiverseexpert.com/cms",
  CMS_FILE_API: "https://api.swaple.multiverseexpert.com/cms-file",
};

export default ConfigStaging;
