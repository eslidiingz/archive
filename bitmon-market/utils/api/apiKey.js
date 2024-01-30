import CryptoJS from "crypto-js";
import { utils } from "ethers";

const secretKey = utils.id("MY_NFT_ADMIN_BIT_GET_MONSTER_KEY");
const connecter = "_";

const fixKey = {
  56: [
    "NHC4rMNl6YQWzYVLOve3RD3UeETiqLrI",
    "ywmMs65OX3DDmgXlmDcuUvE6N1pVVSPf",
    "2T9giFfB4M81bNZshBObAobltvrmr8rD",
    "oAlz3BNF6gFCaD0chn5tu6glHEFk4JOL",
    "fxqRDlrDLaGYvXKc9GTJchWmp6APCkbK",
    "5garVDIMlGCXY7pgQGkk5i9cMSdJj5T7",
    "BEKK5ePPLvr3DbTC4vJLN2M4WyI9MIlz",
    "K8F4pyiIbeB7c2Y2E1hLMla6HrsKRnZ1",
    "M5KVfl8IWfVrAVhiNqId06Eyewq7Ba6Z",
    "pOltb7HCwl0uuLppxeZJOgQBdv3FI48w",
    "aGLAZjbCiqjZhqC3955QR7lggRHn6lzJ",
    "dawrewoMYInvCvjfwoReAUffkOZrPIEn",
    "ifjmhUF4EYddFyrUPzF3AoLUXNybUeVF",
    "Q1zwg3SSQL6YdFbD2i40gRjirUOSEX92",
    "GeHpuCUVA1ASHxQMBj6dca2bs11rBg5I",
    "ql097vbUBgjUQzaYzFfKDd3oQDJn0bV6",
  ],
  97: [
    "q2fJlY4y2K3PZMIcblS1BdxKhn64CdGR",
    "5dJ088ZspKi8U74ll9oN8odhjwoxsfNA",
    "oQdx9stMKU4TCF3qCwmFNoW6bhrGp6fa",
    "VaG4WPHloUoItl7C0pKk5l5ZnzgSqPYS",
    "UA97PK0WmMo9JoPkzth6SKrKPEHMktDQ",
    "EvK23yzq3mNyd44hix6Wab1VC8P3HiWG",
    "z3m9nAYGTOJX5DdcelaGocKkquL81wlf",
    "HktWS7MWqlvXs4j3Y4kWPrOsPmWbcVV2",
    "fskYSxsLONWD6BWrNKU1zk8um3bl7K5s",
    "WLta3QUFdkmROtvJLTHsKC7Cl1tmpjJr",
    "lKXzEG8BcUWEJEqkrULZGypo8jPWMlAY",
    "bXku6vvFo3pRHwR535SaV5VUvw6TWG3j",
    "O4f9ulSGL37jX8H81dSIKmaoISiRxUJe",
    "jKnqcA3QjzdLwjQwSJKtzWhkvjNYXuTe",
    "a6adgqsK1VLvqlpDAVMLucBJ9vOokUpR",
    "25hhmxjLdRcvtSRSYIUnvbc69RpPRTcX",
  ],
  80001: [
    "q2fJlY4y2K3PZMIcblS1BdxKhn64CdGR",
    "5dJ088ZspKi8U74ll9oN8odhjwoxsfNA",
    "oQdx9stMKU4TCF3qCwmFNoW6bhrGp6fa",
    "VaG4WPHloUoItl7C0pKk5l5ZnzgSqPYS",
    "UA97PK0WmMo9JoPkzth6SKrKPEHMktDQ",
    "EvK23yzq3mNyd44hix6Wab1VC8P3HiWG",
    "z3m9nAYGTOJX5DdcelaGocKkquL81wlf",
    "HktWS7MWqlvXs4j3Y4kWPrOsPmWbcVV2",
    "fskYSxsLONWD6BWrNKU1zk8um3bl7K5s",
    "WLta3QUFdkmROtvJLTHsKC7Cl1tmpjJr",
    "lKXzEG8BcUWEJEqkrULZGypo8jPWMlAY",
    "bXku6vvFo3pRHwR535SaV5VUvw6TWG3j",
    "O4f9ulSGL37jX8H81dSIKmaoISiRxUJe",
    "jKnqcA3QjzdLwjQwSJKtzWhkvjNYXuTe",
    "a6adgqsK1VLvqlpDAVMLucBJ9vOokUpR",
    "25hhmxjLdRcvtSRSYIUnvbc69RpPRTcX",
  ],
};

const useFixKey = fixKey[process.env.CHAIN_ID];

export const encodeKey = (wallet) => {
  const start = random(16),
    end = random(16);
  const textStart = generateText(start),
    textEnd = generateText(end);
  const rand = random(9999999) - start * end;
  const now = new Date().getTime();
  const indexKey = random(useFixKey.length) - 1;
  const indexStart = ("00" + indexKey).slice(-2).charAt(0);
  const indexEnd = ("00" + indexKey).slice(-1);
  const text =
    ("00" + start).slice(-2) +
    textStart +
    rand +
    connecter +
    wallet +
    connecter +
    (indexStart + useFixKey[indexKey] + indexEnd) +
    connecter +
    now +
    textEnd +
    ("00" + end).slice(-2);
  console.log("text", text);
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const random = (maxLength) => {
  return Math.floor(Math.random() * maxLength) + 1;
};

const generateText = (length) => {
  const charset =
    "_#&.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    result += charset.charAt(Math.floor(Math.random() * n));
  }
  return result;
};
