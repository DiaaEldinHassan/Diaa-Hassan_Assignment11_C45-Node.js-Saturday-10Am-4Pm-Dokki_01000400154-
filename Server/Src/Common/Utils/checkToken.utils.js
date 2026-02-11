import { throwError, verifyToken } from "./index.js";

export async function checkToken(token) {
    if(!token || !token.startsWith("Bearer")) throwError(401,"User is not authorized");
    const header=token.split(" ")[1];
    const user=await verifyToken(header);
    return user;
}