import { Router } from "express";
import { userGetData, getMessages } from "./users.service.js";
import { authorization, success } from "../../index.js";
import { role } from "../../Common/Enums/role.enum.js";
import { upload } from "../../Common/Middlewares/multer.middleware.js";

export const router = Router();

router.get(
  "/profile",
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
      console.log(req.user);
      const user = await userGetData(req.headers.authorization);
      success(res, 200, user.message, user.data);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/upload",
  authorization([role.User, role.Admin]),
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    success(res, 200, "File uploaded successfully", {
      filename: req.file.filename,
      path: req.file.path,
    });
  },
);

router.get(
  "/messages",
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
      const user = await getMessages(req.user);
      success(res, 200, user);
    } catch (error) {
      next(error);
    }
  },
);
