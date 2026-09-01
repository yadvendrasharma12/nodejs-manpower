import {env} from './config/env.js'
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js"
const app = express();


app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
    origin:env.CORS_ORIGIN,
    credentials:true
  }
));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile",profileRouter)


app.use(errorMiddleware);

export default app;