const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.delete("/profile/:id", async(req, res) => {
  const userId = req.params.id;
  try{
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }
  catch(err){
    res.status(500).send(err.message);
  } 
});

profileRouter.patch("/profile/:id", async(req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  const ALLOWED_UPDATES = ["firstName", "lastName", "skills", "shortDesc"];
  const isValidUpdate = Object.keys(updateData).every((key) => ALLOWED_UPDATES.includes(key));

  if(updateData.skills.length>10){
    return res.status(400).send("Skills cannot have more than 10 items.");
  }
  if(!isValidUpdate){
    return res.status(400).send("Invalid updates! Only firstName, lastName, skills and shortDesc can be updated.");
  }
  try{
    await User.findByIdAndUpdate(userId, updateData, {new: true, runValidators: true});
    res.send("User updated successfully");
  }
  catch(err){
    res.status(500).send(err.message);
  } 
});

profileRouter.get("/profile", userAuth, async(req,res) =>{
  try{
      const user = req.user;
    res.json(user); 
  }
  catch(err){
    res.status(500).send(err.message);
  }
})
module.exports = profileRouter;