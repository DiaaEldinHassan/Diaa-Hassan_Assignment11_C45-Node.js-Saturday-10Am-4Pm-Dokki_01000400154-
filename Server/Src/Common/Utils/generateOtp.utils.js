import { otpModel } from "../../DB/index.js";

export async function generateOTP(userId, type = "login") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  
  await otpModel.create({ userId, otp, expiresAt, type });

  return otp;
}
