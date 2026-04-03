const express = require("express");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const requestRouter = express.Router();


requestRouter.post("/sendConnectionRequest/:id", async(req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.params.id;

  try{
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if(!sender || !receiver){
      return res.status(404).send("Sender or receiver not found.");
    }

    if(sender.sentRequests.includes(receiverId)){
      return res.status(400).send("Request already sent.");
    }

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.send("Request sent successfully");
  }
  catch(err){
    res.status(500).send(err.message);
  }
})

module.exports = requestRouter;