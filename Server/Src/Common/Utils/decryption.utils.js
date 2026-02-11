import crypto from "crypto";
export function decryptWithPassword(encryptedData, password, iv, salt) {
  const key = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, "base64"),
    100000,
    32,
    "sha256",
  );
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "base64"),
  );

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}


export function hybridDecrypt(messages, privateKey) {
  return messages.map((message) => {
    // Decrypt AES key using RSA private key with OAEP
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // ✅ Use OAEP
        oaepHash: "sha256", // recommended hash
      },
      Buffer.from(message.encryptedKey, "base64")
    );

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      aesKey,
      Buffer.from(message.iv, "base64")
    );

    let decrypted = decipher.update(message.content, "base64", "utf8"); 
    decrypted += decipher.final("utf8");

    return {
      ...message._doc,
      content: decrypted, 
    };
  });
}