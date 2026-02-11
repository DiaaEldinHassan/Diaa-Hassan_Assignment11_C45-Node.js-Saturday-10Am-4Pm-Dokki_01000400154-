import mongoose from "mongoose";
const schema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  content: {          
    type: String,
    required: true,
  },
  encryptedKey: {         
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, collection: "Messages" });

export const messageModel = mongoose.models.Messages || mongoose.model("Messages", schema);
