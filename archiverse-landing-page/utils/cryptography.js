import crypto from "crypto";
import Config from "../configs/config";

const ALGORITHM = "aes-256-cbc";
const CIPHER_KEY = Config.BRIDGE_ENCRYPT_KEY; // Same key used in Golang
const BLOCK_SIZE = 16;

export const decrypt = (cipherText) => {
  const contents = Buffer.from(cipherText, "hex");
  const iv = contents.slice(0, BLOCK_SIZE);
  const textBytes = contents.slice(BLOCK_SIZE);

  const decipher = crypto.createDecipheriv(ALGORITHM, CIPHER_KEY, iv);
  let decrypted = decipher.update(textBytes, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(BLOCK_SIZE);
  const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, iv);
  let cipherText;
  try {
    cipherText = cipher.update(plainText, "utf8", "hex");
    cipherText += cipher.final("hex");
    cipherText = iv.toString("hex") + cipherText;
  } catch (e) {
    cipherText = null;
  }
  return cipherText;
};
