import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    type: { type: String, enum: ["login", "reset"], default: "login" },
  },
  { timestamps: true, collection: "OTPs" },
);

export const otpModel =
  mongoose.models.OTPs || mongoose.model("OTPs", otpSchema);
