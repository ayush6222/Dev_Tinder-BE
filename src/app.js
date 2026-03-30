const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();

app.post("/signup", async(req, res) => {
  const user = new User({
    firstName:"Nikita",
    lastName:"Jaiswal",
    emailId:"test2@gmail.com",
    password:"test1234",
    age:22,
    gender:"female" 

  })
  try{
  await user.save()
  res.send("User added successfully");
  }
  catch(err){
    res.status(500).send("Error adding user");
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
