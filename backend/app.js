import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import dbConnection from "./database/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

// DB
dbConnection();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Error middleware
app.use(errorMiddleware);

export default app;