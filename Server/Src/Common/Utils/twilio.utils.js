import twilio from "twilio";
import { otpModel } from "../../index.js";
import { throwError } from "./index.js";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export async function sendOTP(phone, otp) {
  return client.messages.create({
    body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone, 
  });
}

export async function verifyOTP(userId, otp, type = "login") {
  const record = await otpModel.findOne({ userId, otp, type });

  if (!record) throwError(400, "Invalid OTP");
  if (record.expiresAt < new Date()) throwError(400, "OTP expired");

  // Remove OTP after successful verification
  await otpModel.deleteOne({ _id: record._id });
  return true;
}
