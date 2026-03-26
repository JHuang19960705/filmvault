const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const contentRoute = require("./routes").content;
const adminRoute = require("./routes").admin;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const port = 3999;


// mongoDB — serverless-safe connection caching
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_CONNECTION, {
    serverSelectionTimeoutMS: 10000,
    bufferCommands: false,
  });
  isConnected = true;
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error("MongoDB connection error:", e);
    res.status(500).send("資料庫連線失敗，請稍後再試。");
  }
});

app.use("/api/user", authRoute);
//要進去必須先登入
app.use("/api/content",
  passport.authenticate("jwt", { session: false }),
  contentRoute
);
app.use("/api/admin", adminRoute);

app.get("/" , (req, res) => {
  res.json("HELLO");
})

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log("server is listening port 3999...");
  });
}

module.exports = app;