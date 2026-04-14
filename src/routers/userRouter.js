const express = require("express");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { connect } = require("mongoose");

const USER_SAFE_DATA = ["firstName", "lastName", "age", "skills"]

userRouter.get("/feed", userAuth, async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  const skip = (page - 1) * limit;

  try {
    const users = await User.find().select(USER_SAFE_DATA);
    const data = users.filter(user => {
      return user._id.toString() !== req.user._id.toString();

    });
    const connections = await ConnectionRequest.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).select("senderId receiverId");
    const connectedUserIds = new Set();
    connections.forEach(connection => {
      if (connection.senderId.toString() === userId.toString()) {
        connectedUserIds.add(connection.receiverId.toString());
      } else {
        connectedUserIds.add(connection.senderId.toString());
      }
    });
    const showUsers = await User.find({
      _id: {
        $nin: Array.from(connectedUserIds),
        $ne: userId
      }
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.json({ message: "Users found", data: showUsers });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})

userRouter.get("/recievedConnectionRequests", userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await ConnectionRequest.find({ receiverId: userId, status: "interested" }).populate("senderId", USER_SAFE_DATA);
    res.json({ message: "Connection requests found", data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/sentConnectionRequests", userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const sentRequests = await ConnectionRequest.find({ senderId: userId, status: "interested" }).populate("receiverId", USER_SAFE_DATA);
    res.json({ message: "Sent connection requests found", data: sentRequests });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { senderId: userId, status: "accepted" },
        { receiverId: userId, status: "accepted" }
      ]
    }).populate("senderId", USER_SAFE_DATA).populate("receiverId", USER_SAFE_DATA);

    const formattedConnections = connections.map(connection => {
      const otherUser = connection.senderId._id.equals(userId) ? connection.receiverId : connection.senderId;
      return {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        age: otherUser.age,
      };
    });

    res.json({ message: "Connections found", data: formattedConnections });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
