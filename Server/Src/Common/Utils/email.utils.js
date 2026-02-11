import nodemailer from "nodemailer";
import { account, password } from "../../../Config/config.service.js";


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: account,      
    pass: password,      
  },
});

// Send OTP email
export async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: account,
    to,
    subject: "Your Verification Code",
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
