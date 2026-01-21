import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import initCronJobs from "./src/utils/scheduler.utils.js";
// Routes for Application

import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import dashboardRouter from "./src/routes/dashboard.routes.js";
import subscriptionRouter from "./src/routes/subscription.routes.js";
import reminderRouter from "./src/routes/reminder.routes.js";
import notificationRouter from "./src/routes/notification.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { ApiError } from "./src/utils/ApiError.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Subscription Tracker Service");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/:subscriptionId/reminders", reminderRouter);
app.use("/api/v1/notifications", notificationRouter);

// for reminders

initCronJobs();

// 404
app.use((req, res, next) => {
  next(new ApiError(404, `Route Not Found: ${req.originalUrl}`));
});

// centralized error handler
app.use(errorMiddleware);

app.listen(port || 3000, () => {
  console.log(
    `App listening on port : ${port}. You can visit it at localhost:${port}`
  );
});
