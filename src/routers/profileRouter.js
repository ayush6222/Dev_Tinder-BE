const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateUpdateData, validatePasswordResetData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {

  try {
    const userId = req.user._id;
    console.log(userId);
    await User.findByIdAndDelete(userId);
    res.send(`User with id ${req.user.firstName} deleted successfully`);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  const updateData = req.body;
  const { isValid, message } = validateUpdateData(updateData);
  if (!isValid) {
    return res.status(400).send(message);
  }
  try {
    const user = req.user;
    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    await user.save();
    res.json({ message: `${user.firstName} updated successfully`, data: user });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
})

profileRouter.patch("/profile/resetPassword", userAuth, async (req,res) =>{
  const {oldPassword, newPassword} = req.body;
  if(!oldPassword || !newPassword){
    return res.status(400).send("Old password and new password are required.");
  }
  const { isValid, message } = validatePasswordResetData({ oldPassword, newPassword });
  if (!isValid) {
    return res.status(400).send(message);
  }
  try{
    const user = req.user;
    const isPasswordMatch = await user.passwordMatching(oldPassword);
    if (!isPasswordMatch) {
      return res.status(400).send("Old password is incorrect.");
    }
    user.password = await user.passwordHashing(newPassword);
    await user.save();
    res.json({ message: "Password updated successfully" });
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = profileRouter;
