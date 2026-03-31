const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async(req, res, next) => {
  try{
  const {token} = req.cookies;
  if(!token){
    return res.status(401).send("Unauthorized: No token provided");
  }
  const decoded = await jwt.verify(token, "dev_tinder_ayush");
  const {userId} = decoded;
  const user = await User.findById(userId);
  if(!user) {
    res.status(401).send("Unauthorized");
  }
  else{
    req.user = user;
    next();
  }
  }
  catch(err){
    res.status(401).send("Unauthorized: Invalid token");
  } 

}
module.exports = {userAuth};