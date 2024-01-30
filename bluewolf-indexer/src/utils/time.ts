export const getTimeStamp = (rawTimestamp: number) => {
    // let rawTimestamp = (await provider.getBlock(logs.blockNumber)).timestamp
    return new Date(rawTimestamp * 1000);
}