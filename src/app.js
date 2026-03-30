const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth");

const app = express();


app.get("/users", (req,res)=>{
  // try{
    throw new Error("Something went wrong");
    res.send("Users route");
  // }
  // catch(err){
  //   res.status(500).send("Internal Server Error");
  // }
});

app.use("/", (err, req, res, next) => {
if(err){
res.status(500).send("Something broke!");
}
  
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});