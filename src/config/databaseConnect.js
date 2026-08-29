import mongoose from "mongoose";
import { env } from "../config/env.js";
import { DB_NAME } from "../constants.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(`${env.mongoUrl}/${DB_NAME}`);

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection error");
    console.log(error.message);
    process.exit(1);
  }
};



// process.exist are used to Application ko error status ke saath stop kar do.