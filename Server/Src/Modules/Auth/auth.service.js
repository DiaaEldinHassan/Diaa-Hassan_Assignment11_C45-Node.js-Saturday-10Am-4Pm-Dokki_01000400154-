import { verifyGoogleToken } from "../../Common/Utils/google.utils.js";
import { userModel } from "../../DB/Models/users.model.js";
import {
  duplicateError,
  generateToken,
  hashCompare,
  throwError,
  throwSuccess,
  decryptWithPassword,
  keyStore,
  verifyToken,
  generateOTP,
  sendOTPEmail
} from "../../Common/index.js";
import { createOne, findOne } from "../../DB/index.js";



export async function signUp(userData) {
  try {
    if (
      !userData.userName ||
      !userData.email ||
      !userData.password ||
      !userData.phone
    ) {
      throwError(404, "Data not found");
    }
    const newUser = await createOne(userData);
    const userObj = newUser.toObject();
    delete userObj.password;
     const otp = await generateOTP(newUser._id);
    await sendOTPEmail(newUser.email, otp);
    return throwSuccess("New User Created Successfully", userObj);
  } catch (error) {
    if (error.code === 11000) duplicateError();
    throwError(error.status || 400, error.message);
  }
}

export async function signIn(userData) {
  if (!userData.email || !userData.password)
    throwError(401, "Please Complete your credentials");
  try {
    const user = await findOne({ email: userData.email });
    if (!user) throwError(401, "User is not exist");
    const verifyUser = await hashCompare(userData.password, user.password);
    if (!verifyUser) throwError(401, "Please Check your password again");
    user.password = undefined;
    const token = await generateToken({ user });
    const privateKey = decryptWithPassword(
      user.encryptedPrivateKey,
      userData.password,
      user.encryptionIv,
      user.encryptionSalt,
    );
    user.privateKey = privateKey;
    keyStore.set(user._id.toString(), privateKey);
    return throwSuccess("Logged in", user, token);
  } catch (error) {
    throwError(error.status || 400, error.message);
  }
}

export async function refreshToken(oldToken) {
  const verified = verifyToken(oldToken);
  const newAccessToken = generateToken(
    { user: verified },
    { expiresIn: "15m" },
  );
  const newRotateToken = generateToken({ user: verified }, { expiresIn: "7d" });

  return { newAccessToken, newRotateToken };
}

export async function googleSignIn(idToken) {
  if (!idToken) throw new Error("Google token required");

  const googleData = await verifyGoogleToken(idToken);

  if (!googleData.emailVerified) throw new Error("Google email not verified");

  let user = await userModel.findOne({
    $or: [{ email: googleData.email }, { googleId: googleData.googleId }],
  });
  if (!user) {
    user = await userModel.create({
      userName: googleData.name,
      email: googleData.email,
      googleId: googleData.googleId,
      provider: "google",
      profileImage: googleData.picture,
      isVerified: true,
    });
  }
  const tokens = generateToken({ user });
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return {
    user,
    ...tokens,
  };
}
