import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import initCronJobs from "./src/utils/scheduler.utils.js";
// Routes for Application

import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import subscriptionRouter from "./src/routes/subscription.routes.js";
import reminderRouter from "./src/routes/reminder.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

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
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/:subscriptionId/reminders", reminderRouter);
//add extra for direct access to reminders
app.use("/api/v1/reminders", reminderRouter);

// for reminders
initCronJobs();

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use((err, req, res, next) => {
  // console.error(err);
  // res.status(err.status || 500).json({ error: err.message || "Server error" });
  const error = new Error("Not Found");
  error.statusCode = 404;
  next();
});

// centralized error handler
app.use(errorMiddleware);

app.listen(port || 3000, () => {
  console.log(
    `App listening on port : ${port}. You can visit it at localhost:${port}`
  );
});
