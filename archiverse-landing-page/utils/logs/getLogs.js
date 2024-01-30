import { web3Provider } from "../providers/connector";

export const getLogsEvent = async (
  _contractInstance,
  _contractAddress,
  _contractStartBlock,
  _contractTopic,
  _chunkBlock = 5000
) => {
  let logs = [],
    chunks = _chunkBlock;
  const provider = web3Provider(null, true);
  const latestBlock = await provider.getBlockNumber();

  for (let i = _contractStartBlock; i < latestBlock; i += chunks) {
    const getLogs = provider.getLogs({
      address: _contractAddress,
      fromBlock: i,
      toBlock: i + chunks - 1,
      topics: [_contractTopic],
    });

    logs.push(getLogs);
  }

  const resultLog = await Promise.all(logs);

  const logArray = resultLog.filter((x) => x.length > 0);

  const log = [].concat.apply([], logArray);

  const result = log.map((_logs) => {
    const data = _contractInstance.interface.parseLog(_logs);

    return data;
  });

  const list = await Promise.all(result);
  return list;
};
