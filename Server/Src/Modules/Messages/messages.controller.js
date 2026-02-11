import { Router } from "express";
import { getMessages, sendMessage } from "./messages.service.js";
import { success } from "../../index.js";

export const router = Router();

router.get("/myMessages", async (req, res, next) => {
  try {
    const user = await getMessages(req.headers.authorization);
    success(res, 200, user.message, user.data);
  } catch (error) {
    next(error);
  }
});

router.post("/sendMessage", async (req, res, next) => {
  try {
    const message = await sendMessage(req.body);
    success(res, 200, message.message, message.data);
  } catch (error) {
    next(error);
  }
});
