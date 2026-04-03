const express = require("express");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/fetchAllUsers", async(req, res) => {
  const cookies = req.cookies;
  const {token} = cookies;

  const decoded = jwt.verify(token, "dev_tinder_ayush");

  try{
    const users = await User.find();
    res.json(users);
  }
  catch(err){
    res.status(500).send(err.message);
  }
})


module.exports = userRouter;