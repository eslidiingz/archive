import Config from "../../configs/config";
import { encodeKey } from "./apiKey";

const HOST_ENDPOINT = Config.REST_API_URL;

export const getAllMonsters = async () => {
  try {
    const response = await fetch(`${HOST_ENDPOINT}/monsters/getAll`);
    const monster = await response.json();
    return monster || [];
  } catch {
    return [];
  }
};

export const getMonsterDetail = async (monsterId) => {
  try {
    if (!monsterId) return null;
    const response = await fetch(
      `${HOST_ENDPOINT}/metadata/monster/${monsterId}`
    );
    const monster = await response.json();
    return monster || null;
  } catch {
    return null;
  }
};

export const insertMonster = async (walletAddress, monsterUid, hash) => {
  try {
    if (!walletAddress || !monsterUid) return false;
    const response = await fetch(`${HOST_ENDPOINT}/admin/monster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": encodeKey(walletAddress),
      },
      body: JSON.stringify({
        walletAddress,
        id: monsterUid,
        default: false,
        hash,
      }),
    });
    const result = await response.json();

    return result?.nModified ? true : false;
  } catch {
    return false;
  }
};
