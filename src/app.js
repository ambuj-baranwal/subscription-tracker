import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(clerkMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World! Jeez");
});


console.log("app")

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);


// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});


app.listen(port, () => {
    console.log("App listening on port " + port);
})
// export default app;
