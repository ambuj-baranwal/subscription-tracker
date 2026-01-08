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

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/:subscriptionId/reminders", reminderRouter);
//add extra for direct access to reminders
app.use("/api/v1/reminders", reminderRouter);

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
  // next()
});

// for reminders
initCronJobs();

app.listen(port || 3000, () => {
  console.log(
    `App listening on port : ${port}. You can visit it at localhost:${port}`
  );
});
