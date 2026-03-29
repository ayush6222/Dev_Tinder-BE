const express = require("express");

const app = express();


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/hello", (req, res) => {
  res.send("Hello, hello!");
});

app.get("/goodbye", (req, res) => {
  res.send("Goodbye, see you later!");
});


app.listen(7777, () => {
  console.log("Server is running on port 7777");
});