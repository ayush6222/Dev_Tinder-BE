
const adminAuth = (req, res, next) => {
    console.log("Enetered admin auth middleware");
  const token = "1234567890"; 
  const isAdmin = token === "1234567890"; 

  if(!isAdmin) {
    res.status(401).send("Unauthorized");
  }
  else{
    next();
  }
};


const userAuth = (req, res, next) => {
    console.log("Enetered user auth middleware");
  const token = "xyz"; 
  const isAdmin = token === "xyz"; 

  if(!isAdmin) {
    res.status(401).send("Unauthorized");
  }
  else{
    next();
  }
};
module.exports = {adminAuth, userAuth};