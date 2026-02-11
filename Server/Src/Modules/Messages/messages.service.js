import {
  throwSuccess,
  throwError,
  checkToken,
  getUserMessages,
  insertMessage,

} from "../../index.js";

export async function getMessages(token) {
  try {
    const user = await checkToken(token);
    console.log(user)
    const messages = await getUserMessages(user.id);
    return throwSuccess("Done", messages);
  } catch (error) {
    throwError(error.status, error.message);
  }
}

export async function sendMessage(data) {
  try {
    const message = await insertMessage(data.recipientId, data.content);
    return throwSuccess("Done", message);
  } catch (error) {
    throwError(error.status, error.message);
  }
}
