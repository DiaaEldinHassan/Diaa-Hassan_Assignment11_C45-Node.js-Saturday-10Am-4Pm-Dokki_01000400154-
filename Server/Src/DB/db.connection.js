import mongoose from "mongoose";
import { dbUri } from "../../Config/config.service.js";
import { throwError } from "../Common/index.js";

export async function connectDB() {
    try {
        await mongoose.connect(dbUri);
        console.log("DB Is Connected Successfully 👌👌");
    } catch (error) {
        throwError(400,"Couldn't Connect to DB 😒😒")
    }
}