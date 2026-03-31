const express = require("express");
const { connectDB } = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const validator = require("validator");
const bcrypt = require('bcrypt');
const { User } = require("./models/user");

const app = express();

app.use(express.json());

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
      return res.status(404).send("User not found.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      return res.status(400).send("Invalid email or password.");
    }

    res.send("Login successful");
  }
  catch(err){
    console.error("Error during login", err.message);
    res.status(500).send(err.message);
  }

})

app.post("/fetchAllUsers", async(req, res) => {
  try{
    const users = await User.find();
    res.json(users);
  }
  catch(err){
    console.error("Error fetching users", err.message);
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
    console.error("Error deleting user", err.message);
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
    console.error("Error updating user", err.message);
    res.status(500).send(err.message);
  } 
});
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
