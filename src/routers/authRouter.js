const express = require("express");
const validator = require("validator");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();



authRouter.post("/signup", async(req, res) => {
  const userData = req.body;
  const user = new User(userData);
  
  validateSignupData(userData);

  const passwordHash = await user.passwordHashing(userData.password);
  user.password = passwordHash;

  try{
  await user.save()
  res.send("User added successfully mittar");
  }
  catch(err){
    res.status(500).send(err.message);
  }

});

authRouter.post("/login", async(req,res) =>{
  const {emailId, password} = req.body;

  if(!validator.isEmail(emailId)){
    return res.status(400).send("Invalid email format.");
  }

  try{
    const user = await User.findOne({emailId});
    if(!user){
      return res.status(404).send("Invalid email or password.");
    }

    const isPasswordMatch = await user.passwordMatching(password);
    if(!isPasswordMatch){
      return res.status(400).send("Invalid email or password.");
    }
    const token = user.getJWTToken();
    res.cookie("token", token, {httpOnly: true, expires: new Date(Date.now() + 1*24*60*60*1000)});
    res.send("Login successful");
  }
  catch(err){
    res.status(500).send(err.message);
  }

})

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful");
})  



module.exports = authRouter;
