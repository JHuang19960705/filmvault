const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const contentRoute = require("./routes").content;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const port = 3999;


// mongoDB
// MONGODB_LOCALHOST
// MONGODB_CONNECTION
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connecting to mongodDB...");
  })
  .catch((e) => {
    console.log(e);
  }); 

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
//要進去必須先登入
app.use("/api/content",
  passport.authenticate("jwt", { session: false }),
  contentRoute
);

app.get("/" , (req, res) => {
  res.json("HELLO");
})

app.listen(port, () => {
  console.log("server is listening port 3999...");
});