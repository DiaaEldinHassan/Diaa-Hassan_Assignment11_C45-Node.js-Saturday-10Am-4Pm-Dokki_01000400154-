import bcrypt from "bcrypt";
import { saltRounds } from "../../../Config/config.service.js";
import { throwError } from "./index.js";

export async function hashing(password) {
  if (!password || !typeof password === String)
    throwError(404, "Please provide password to sign up 😊");
  const salt = await bcrypt.genSalt(Number(saltRounds));
  return bcrypt.hash(password, salt);
}

export async function hashCompare(password, hashedPassword) {
  if (!password || !hashedPassword)
    throwError(404, "User credentials is not complete");
  return bcrypt.compare(password, hashedPassword);
}
