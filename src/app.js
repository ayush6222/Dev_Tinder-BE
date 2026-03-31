const express = require("express");
const { connectDB } = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const validator = require("validator");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { User } = require("./models/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req, res) => {
  const userData = req.body;
  const user = new User(userData);
  
  validateSignupData(userData);

  const passwordHash = await bcrypt.hash(userData.password, 10);
  user.password = passwordHash;

  try{
  await user.save()
  res.send("User added successfully mittar");
  }
  catch(err){
    res.status(500).send(err.message);
  }

});

app.post("/login", async(req,res) =>{
  const {emailId, password} = req.body;

  if(!validator.isEmail(emailId)){
    return res.status(400).send("Invalid email format.");
  }

  try{
    const user = await User.findOne({emailId});
    if(!user){
      return res.status(404).send("Invalid email or password.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      return res.status(400).send("Invalid email or password.");
    }
    const token = jwt.sign({userId: user._id}, "dev_tinder_ayush", {expiresIn: "1h"}, (err, token) => {
      if(err){
        return res.status(500).send("Error generating token");
      }
      res.cookie("token", token, {httpOnly: true});
      res.send("Login successful");
    });
  }
  catch(err){
    res.status(500).send(err.message);
  }

})

app.post("/fetchAllUsers", async(req, res) => {
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

app.delete("/user/:id", async(req, res) => {
  const userId = req.params.id;
  try{
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }
  catch(err){
    res.status(500).send(err.message);
  } 
});

app.patch("/user/:id", async(req, res) => {
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

app.get("/profile", async(req,res) =>{
  const cookies = req.cookies;
  const {token} = cookies;

  if(!token){
    return res.status(401).send("Unauthorized: No token provided");
  }
  const decoded = jwt.verify(token, "dev_tinder_ayush");
  const {userId} = decoded;

  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send("User not found");
    }
    res.json(user); 
  }
  catch(err){
    res.status(500).send(err.message);
  }
})
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
