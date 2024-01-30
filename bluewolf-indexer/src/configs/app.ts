import "dotenv/config"

export const AppConfig = {
    DATABASE_URL: process.env.DATABASE_URL,
    WS_RPC_URL: process.env.WS_RPC_URL,
    MARKET_ADDRESS: process.env.MARKET_ADDRESS,
    MARKET_START_BLOCK: process.env.MARKET_START_BLOCK,
    NFT_ADDRESS: process.env.NFT_ADDRESS,
    NFT_START_BLOCK: process.env.NFT_START_BLOCK
}