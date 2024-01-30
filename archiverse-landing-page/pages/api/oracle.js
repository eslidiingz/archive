import { ethers } from "ethers";
import Config from "../../configs/config";

export default async function handler(req, res) {
  const { busdAmount } = req.body;
  const SALT_API_KEY = Config.SALT_API_KEY;
  try {
    const getSignOracle = await fetch(
      `${Config.ORACLE_API_URI}/oracle/${busdAmount}`,
      {
        headers: {
          "Content-type": "application/json",
          "API-KEY": SALT_API_KEY,
        },
      }
    );
    const result = await getSignOracle.json();
    const resInEth = ethers.utils.formatEther(result);
    res.status(200).send(resInEth);
  } catch (e) {
    console.log("🚀 ~ file: oracle.js ~ line 21 ~ handler ~ e", e);
    res.status(400).send("Oracle fail");
  }
}
