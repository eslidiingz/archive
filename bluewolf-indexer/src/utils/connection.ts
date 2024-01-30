import { PrismaClient } from "@prisma/client";
import { providers } from "ethers";
import { AppConfig } from "../configs/app";

const prisma = new PrismaClient()

const provider = new providers.JsonRpcProvider(
    AppConfig.WS_RPC_URL as any
);

export {
    prisma,
    provider
}