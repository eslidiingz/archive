import { ethers } from "ethers";
import Config from "../../configs/config";

export default async function handler(req, res) {
  try {
    const fetchBridgeLock = await fetch(
      `${Config.BRIDGE_API_URL}/bridge-lock`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-API-KEY": Config.BRIDGE_API_KEY,
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await fetchBridgeLock.json();
    res.status(200).send(result);
  } catch (e) {
    console.log("🚀 ~ file: bridge.js ~ line 20 ~ handler ~ e", e);
    res.status(400).send("Oracle fail");
  }
}
