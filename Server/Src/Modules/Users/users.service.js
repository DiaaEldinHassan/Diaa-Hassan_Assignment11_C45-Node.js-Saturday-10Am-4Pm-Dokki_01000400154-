import { throwSuccess, checkToken, throwError } from "../../Common/index.js";

export async function userGetData(token) {
  try {
    const user = await checkToken(token);
    return throwSuccess("User found", user);
  } catch (error) {
    throwError(error.status, error.message);
  }
}

export async function getMessages(userData) {
  console.log(userData)
}