import { Router } from "express";
import { success } from "../../Common/index.js";
import { signIn, signUp, googleSignIn, refreshToken } from "./auth.service.js";

export const router = Router();

router.post("/signUp", async (req, res, next) => {
  try {
    const userData = await signUp(req.body);
    success(res, 200, userData.message, userData.data);
  } catch (error) {
    next(error);
  }
});

router.post("/signIn", async (req, res, next) => {
  try {
    const userData = await signIn(req.body);
    success(res, 200, userData.message, userData.data, userData.token);
  } catch (error) {
    next(error);
  }
});

router.get("/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken: oldToken } = req.body;

    if (!oldToken) {
      throwError(400, "Refresh token is required");
    }

    const tokens = await refreshToken(oldToken); // calls your service
    success(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/signup/gmail", async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const result = await googleSignIn(idToken);

    res.status(200).json({
      message: "Google login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
});
