import Config from "../../configs/config";
import { encodeKey } from "./apiKey";

const HOST_ENDPOINT = Config.REST_API_URL;

export const insertLand = async (data) => {
  try {
    console.log("insertLand", data);
    if (!data?.walletAddress) return false;

    const response = await fetch(`${HOST_ENDPOINT}/admin/land`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": encodeKey(data.walletAddress),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result?.nModified ? true : false;
  } catch {
    return false;
  }
};
