//OM Chain
const ConfigLocal = {
  CHAIN_ID: 1246,
  RPC: "https://rpc.omplatform.com",

  BSC_CHAIN_ID: 97,
  BSC_EXPLORER: "https://testnet.bscscan.com",
  BSC_RPC: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  BSC_BUSD_CA: "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb",

  EXPLORER: "https://evm-explorer.omplatform.com",
  SETTER_WALLET:
    "6a4e6542a16058031948e10d833df28b41b0ed5ffc39c3fdac30d778f694131b",
  SALT_API_KEY: "ZV$tz4qbu^sEBhSk",

  BUSD_CA: "0x95b9A75B9a62AC3e456Ce7f2aF3dBFaA6365E113",
  ASSET_CA: "0xa3caFe0fb9fCFAdff834Fb733d8eacEff14Cd405",
  MARKETPLACE_CA: "0x0F17eb4803725fD2db989Cd7f7a7834278DF1202",
  LAUNCHPAD_CA: "0x51F5990ca057A57007d4DdfeE6759bBD768f36dA",
  WRAPPER_TOKEN_CA: "0xC0cE371634694B95487C3d9A1261aA9c05725af1", // verify native token
  WHITELIST_TOKEN_CA: "0x1B2dCaE7D76AFcc3B4A71d07d892167f160A8A82",

  ASSET_ABI: require("../abis/local/Asset.json"),
  MARKETPLACE_ABI: require("../abis/local/Marketplace.json"),
  LAUNCHPAD_ABI: require("../abis/local/LaunchPad.json"),
  ERC20_ABI: require("../abis/local/Erc20.json"),
  MULTICALL_ABI: require("../abis/local/Multicall.json"),
  WRAPPER_ABI: require("../abis/local/WrapperToken.json"),
  WHITELIST_ABI: require("../abis/local/WhitelistToken.json"),

  MARKETPLACE_BLOCK_START: 5109524,
  ASSET_BLOCK_START: 5109526,
  UNLIMIT_ALLOWANCE: "1000000000000000000000000000",

  MARKETPLACE_BLOCK_START: 5109524,
  ASSET_BLOCK_START: 5109526,
  UNLIMIT_ALLOWANCE: "1000000000000000000000000000",
  DEV_URL: "http://167.71.200.49:8080",
  GET_FILE_URI: "http://167.71.200.49:18800",
  FILE_SERVER_URI: "http://167.71.200.49:3100/upload",
  METADATA_SERVER_URI: "http://167.71.200.49:3100/upload-metadata",
  REST_URI: "",
  GQL_URI: "http://167.71.200.49:8080/v1/graphql",
  GQL_PASS: "dev@1Mex",
  COVEST_API_URI: "https://api.covest.finance/api",
  ORACLE_API_URI: "http://167.71.200.49:3900",

  BRIDGE_BSC_CA: "0xF14fD69890bD00A1F5B7f6351e4D4dD7C4b27d37",
  BRIDGE_OM_CA: "0x625fDFFDF2E5516070f42cBf05e6B0B4146B4e94",
  BRIDGE_ABI: require("../abis/local/Bridge.json"),

  BRIDGE_API_URL: "https://api.swaple.app",
  BRIDGE_API_KEY: "1234",
  BRIDGE_ENCRYPT_KEY: "abcdefghijklmnopqrstuvwxyz012345",

  // ORACLE_API_URI: "http://localhost:3100"

  OM_TOPUP_API_KEY: "daffa4eb-3c0c-4e93-8896-13a3d6ba8a63",
  OM_TOPUP_API_URL: "https://ccw-api.leafbot.io/webhook/wallet-topup-request",

  CMS_API: "https://api.swaple.app/cms",
  CMS_FILE_API: "https://api.swaple.app/cms-file",
};

// 0x8195fB43c73E577d66f07C55f863C8607b0976A6 MBUSD

export default ConfigLocal;
