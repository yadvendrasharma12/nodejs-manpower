import { env } from './config/env.js'
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js"
import { authLimiter } from './utils/authLimiter.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from "./routes/projectRoutes.js";
import projectAssignRoutes from "./routes/projectAssignRoutes.js";
import ManpowerRoutes from './routes/manpowerRoutes.js';

const app = express();
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "20kb",
}));
app.use(express.static("public"));
app.use(cookieParser());

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}
));
app.use("/api/v1/auth", authLimiter);

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/assign", projectAssignRoutes);
app.use("/api/v1/manpower", ManpowerRoutes)


//Admin
app.use('/api/v1/admin', adminRoutes);


app.use(errorMiddleware);

export default app;