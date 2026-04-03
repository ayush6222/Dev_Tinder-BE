const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const requestRouter = require("./routers/requestRouter");
const profileRouter = require("./routers/profileRouter");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter, userRouter, requestRouter, profileRouter);





connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
