import { getTimeStamp } from './../utils/time';
import { BigNumber, Contract, ethers } from "ethers"
import { AppConfig } from "../configs/app"
import { default as abis } from "../configs/abis/nft.json";
import { prisma, provider } from "../utils/connection";
import { hexZeroPad, id } from "ethers/lib/utils";
import { NFTEvent } from "../constants/events/nft";

export const mint = async () => {
    try {
        const contract = new Contract(AppConfig.NFT_ADDRESS as string, abis, provider)

        const filter = contract.filters.Transfer(ethers.constants.AddressZero, null, null);
        
        const logs = await contract.queryFilter(filter, parseInt(AppConfig.NFT_START_BLOCK as string) as number, "latest");

        const mintEvent: any = logs.map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })

            if (query <= 0) {
                const data = contract.interface.parseLog(logs)
                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    to,
                    tokenId,
                } = data.args

                return {
                    event: "MintEvent",
                    blockHash: logs.blockHash,
                    owner: to,
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    timestamp: timestamp,
                    transactionHash: transactionHash
                }
            }
        });

        const mintEventData = await Promise.all(mintEvent)

        const result = await prisma.itemHistory.createMany({ data: mintEventData as any, skipDuplicates: false })

        return result
    } catch (error) {
        console.log(error)
    }

}