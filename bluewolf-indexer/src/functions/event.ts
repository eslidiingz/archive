import { getTimeStamp } from './../utils/time';
import { BigNumber, Contract, providers } from "ethers";
import { AppConfig } from "../configs/app";
import { prisma, provider } from "../utils/connection";
import { default as abis } from "../configs/abis/market.json";
import { formatEther, formatUnits, id, parseUnits } from "ethers/lib/utils";
import { MarketEvents } from "../constants/events/market";


export const OrderCreatedEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)

        const topic = id(MarketEvents[0])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }


        const createEvent: any = (await provider.getLogs(filter)).map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })

            if (query <= 0) {
                const data = contract.interface.parseLog(logs)
                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;

                const {
                    nftContract,
                    orderId,
                    tokenId,
                    seller,
                    price,
                    buyWithTokenContract,
                    isOpen,
                    isSold,
                    isOffered
                } = data.args

                return {
                    event: "OrderCreatedEvent",
                    blockHash: logs.blockHash,
                    nftContract,
                    orderId: BigNumber.from(orderId).toNumber(),
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    seller,
                    price: parseFloat(formatEther(BigNumber.from(price))),
                    buyWithTokenContract,
                    isOpen,
                    isSold,
                    isOffered,
                    transactionHash,
                    timestamp
                }
            }

        });

        const createEventData = await Promise.all(createEvent)

        const result = await prisma.itemHistory.createMany({ data: createEventData as any, skipDuplicates: false }).catch((error) => console.log(error))
        return result
    } catch (error) {
        console.log(error)
    }

}

export const BougthEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)

        const topic = id(MarketEvents[2])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }

        const bougthEvent: any = (await provider.getLogs(filter)).map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })
            if (query <= 0) {
                const data = contract.interface.parseLog(logs)
                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    nftContract,
                    orderId,
                    tokenId,
                    seller,
                    buyer,
                    price,
                    fee,
                    buyWithTokenContract,
                    isOpen,
                    isSold
                } = data.args

                return {
                    event: "BougthEvent",
                    blockHash: logs.blockHash,
                    nftContract,
                    orderId: BigNumber.from(orderId).toNumber(),
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    seller,
                    buyer,
                    price: parseFloat(formatEther(BigNumber.from(price))),
                    fee: parseFloat(formatEther(BigNumber.from(fee))),
                    buyWithTokenContract,
                    isOpen,
                    isSold,
                    timestamp,
                    transactionHash
                }
            }
        });

        const bougthEventData = await Promise.all(bougthEvent)
        const result = await prisma.itemHistory.createMany({ data: bougthEventData as any, skipDuplicates: false }).catch((error) => console.log(error))
        return result
    } catch (error) {
        console.log(error)
    }

}


export const AcceptOfferEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)


        const topic = id(MarketEvents[5])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }

        const acceptOfferEvent: any = (await provider.getLogs(filter)).map(async (logs) => {

            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })

            if (query <= 0) {
                const data = contract.interface.parseLog(logs)

                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    nftContract,
                    tokenId,
                    seller,
                    buyer,
                    price,
                    offerId,
                    isSold,
                } = data.args
                return {
                    event: "AcceptOfferEvent",
                    blockHash: logs.blockHash,
                    nftContract,
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    offerId: BigNumber.from(offerId).toNumber(),
                    seller,
                    buyer,
                    price: parseFloat(formatEther(BigNumber.from(price))),
                    timestamp,
                    transactionHash,
                    isSold,
                }
            }
        });

        const acceptOfferEventData = await Promise.all(acceptOfferEvent);

        const result = await prisma.itemHistory.createMany({ data: acceptOfferEventData as any, skipDuplicates: false }).catch((error) => console.log(error))

        return result
    } catch (error) {
        console.log(error)
    }

}


export const OrderCanceledEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)

        const topic = id(MarketEvents[1])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }
        const orderCanceledEvent: any = (await provider.getLogs(filter)).map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })
            if (query <= 0) {
                const data = contract.interface.parseLog(logs)
                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    nftContract,
                    orderId,
                    tokenId,
                    seller,
                    buyWithTokenContract,
                    isOpen,
                    isSold,
                    isOffered,
                } = data.args

                return {
                    event: "OrderCanceledEvent",
                    blockHash: logs.blockHash,
                    nftContract,
                    orderId: BigNumber.from(orderId).toNumber(),
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    seller: seller,
                    timestamp,
                    transactionHash,
                    buyWithTokenContract,
                    isOpen,
                    isSold,
                    isOffered
                }
            }
        });
        const orderCanceledEventData = await Promise.all(orderCanceledEvent);
        console.log(orderCanceledEventData)
        const result = await prisma.itemHistory.createMany({ data: orderCanceledEventData as any, skipDuplicates: false }).catch((error) => console.log(error))
        return result
    } catch (error) {
        console.log(error)
    }

}

export const CreateOfferEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)

        const topic = id(MarketEvents[3])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }
        const createOfferEvent: any = (await provider.getLogs(filter)).map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })
            if (query <= 0) {
                const data = contract.interface.parseLog(logs)
                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    nftContract,
                    tokenId,
                    seller,
                    buyer,
                    price,
                    buyWithTokenContract,
                    offerId,
                    active,
                    isSold
                } = data.args
                let locked = !active;
                return {
                    event: "CreateOfferEvent",
                    blockHash: logs.blockHash,
                    nftContract,
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    offerId: BigNumber.from(offerId).toNumber(),
                    seller,
                    buyer,
                    price: parseFloat(formatEther(BigNumber.from(price))),
                    fee: 0,
                    buyWithTokenContract,
                    isSold,
                    timestamp,
                    transactionHash
                }
            }
        });
        const createOfferEventData = await Promise.all(createOfferEvent);
        const result = await prisma.itemHistory.createMany({ data: createOfferEventData as any, skipDuplicates: false }).catch((error) => console.log(error))
        return result
    } catch (error) {
        console.log(error)
    }
}

export const CancelOfferEvent = async () => {
    try {
        const contract = new Contract(AppConfig.MARKET_ADDRESS as string, abis, provider)

        const topic = id(MarketEvents[4])
        const filter = {
            address: AppConfig.MARKET_ADDRESS,
            fromBlock: parseInt(AppConfig.MARKET_START_BLOCK as string) as number,
            toBlock: 'latest',
            topics: [topic]
        }
        const cancelOfferEvent: any = (await provider.getLogs(filter)).map(async (logs) => {
            const query = await prisma.itemHistory.count({ where: { blockHash: logs.blockHash } })
            if (query <= 0) {
                const data = contract.interface.parseLog(logs)

                let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
                let timestamp = getTimeStamp(rawTimestamp);
                let transactionHash = logs.transactionHash;
                const {
                    tokenId,
                    buyer,
                    offerId,
                } = data.args
                return {
                    event: "CancelOfferEvent",
                    blockHash: logs.blockHash,
                    tokenId: BigNumber.from(tokenId).toNumber(),
                    offerId: BigNumber.from(offerId).toNumber(),
                    buyer,
                    fee: 0,
                    timestamp,
                    transactionHash,
                }
            }
        });
        const cancelOfferEventData = await Promise.all(cancelOfferEvent);
        const result = await prisma.itemHistory.createMany({ data: cancelOfferEventData as any, skipDuplicates: false }).catch((error) => console.log(error))
        return result
    } catch (error) {
        console.log(error)
    }
}