import crypto from "crypto";
import { throwError } from "./index.js";
import { encryptionSecretKey } from "../../../Config/config.service.js";

export function encryptWithPassword(plainText, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);

  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");

  return {
    encryptedData: encrypted,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
  };
}

export function encryption(data) {
  if (!Array.isArray(data)) throwError(404, "Phone Numbers must be an array");
  const alg = "aes-256-gcm";
  const key = crypto.createHash("sha256").update(encryptionSecretKey).digest();
  return data.map((d) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(alg, key, iv);
    let encrypted = cipher.update(d,"utf-8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), number: encrypted };
  });
}

export function hybridEncrypt(message, publicKey) {
  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
  let encryptedContent = cipher.update(message, "utf8", "base64");
  encryptedContent += cipher.final("base64");

  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    aesKey,
  );

  return {
    encryptedContent,
    encryptedKey: encryptedKey.toString("base64"),
    iv: iv.toString("base64"),
  };
}
