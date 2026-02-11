import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve("Config/.env.development") });

export const serverPort = process.env.PORT || 3000;
export const dbUri = process.env.DB_URI;
export const user_sk = process.env.US_SK;
export const sys_sk=process.env.SYS_SK;
export const access_sk=process.env.ACCESS_SK;
export const refresh_sk=process.env.REFRESH_SK;
export const account=process.env.ACCOUNT;
export const password=process.env.PASSWORD;
export const encryptionSecretKey = process.env.ENC_SK;
export const saltRounds = process.env.SALT;
