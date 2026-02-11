import { messageModel, userModel } from "./index.js";
import bcrypt from "bcrypt";
import {
  generateAsymmetricKeyPair,
  encryptWithPassword,
  throwError,
  hybridEncrypt,
  hybridDecrypt,
  keyStore,
  role,
  encryption,
} from "../Common/index.js";

export async function createOne(data) {
  const { publicKey, privateKey } = generateAsymmetricKeyPair();
  const encrypted = encryptWithPassword(privateKey, data.password);
  const encryptedPhone=encryption(data.phone)
  return await userModel.create({
    userName: data.userName,
    email: data.email,
    password: data.password,
    phone: encryptedPhone,
    role:data.role,
    publicKey,
    encryptedPrivateKey: encrypted.encryptedData,
    encryptionSalt: encrypted.salt,
    encryptionIv: encrypted.iv,
  });
}

export async function findOne(filter = {}, select = {}, options = {}) {
  return await userModel.findOne(filter);
}

export async function getUserMessages(id) {
  const privateKey = keyStore.get(id.toString());
  if (!privateKey)
    throwError(401, "Private key not found (user not logged in)");

  const messages = await messageModel.find({ recipientId: id });
  if (!messages.length) return [];

  return hybridDecrypt(messages, privateKey);
}

export async function insertMessage(recipientId, content) {
  if (!content || content.length === 0)
    throwError(400, "Please provide a message");

  const recipient = await userModel.findById(recipientId);
  if (!recipient) throwError(404, "Recipient not found");

  const encrypted = hybridEncrypt(content, recipient.publicKey);

  return await messageModel.create({
    recipientId,
    content: encrypted.encryptedContent, 
    encryptedKey: encrypted.encryptedKey,
    iv: encrypted.iv,
  });
}
