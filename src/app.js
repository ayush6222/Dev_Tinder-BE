const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth");

const app = express();


app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/admin/getAllUsers", (req, res) => {
    res.send("List of all users");
})

app.get("/user/createPost", (req, res) => {
    res.send("Post created successfully");
})

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});