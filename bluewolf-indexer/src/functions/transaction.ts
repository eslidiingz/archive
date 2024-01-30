import { providers, utils } from "ethers"
import { id } from "ethers/lib/utils"
import { AppConfig } from "../configs/app"
import { MarketEvents } from "../constants/events/market"
import { prisma, provider } from "../utils/connection"

export type Logs = {
    blockNumber: Number,
    blockHash: String,
    transactionIndex: Number,
    address: String,
    transactionHash: String
}

export const createTransaction = async () => {
    
    const topics: string[] = MarketEvents.map((_i) => {
        return id(_i)
    })

    const filter = {
        address: AppConfig.MARKET_ADDRESS,
        fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as any),
        toBlock: "latest",
        topics: [topics],
    };

    const logs: any = (await provider.getLogs(filter)).map(async (_i) => {
        const query = await prisma.itemHistory.count({ where: { blockHash: _i.blockHash } })
        if(query <= 0){
            return {
                blockNumber: _i.blockNumber,
                blockHash: _i.blockHash,
                transactionIndex: _i.transactionIndex,
                address: _i.address,
                transactionHash: _i.transactionHash
            }
        }
    });
    const logsData = await Promise.all(logs);

    const result = await prisma.transaction.createMany({ data: logsData as any, skipDuplicates: false })

    return result
}