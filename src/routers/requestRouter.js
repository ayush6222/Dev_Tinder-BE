const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();


requestRouter.post("/request/sendConnectionRequest/:status/:toUserId", userAuth, async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.toUserId;
  const status = req.params.status;

  const allowedStatuses = ["ignored", "interested"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value " + status });
  };


  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  })

  if (existingRequest) {
    return res.status(400).json({ message: "Connection request already exists between these users." });
  }

  const receiverExists = await User.findById(receiverId);
  if (!receiverExists) {
    return res.status(404).json({ message: "Receiver user not found." });
  }

  try {


    const requestData = new ConnectionRequest({
      senderId,
      receiverId: receiverId,
      status: status
    });

    await requestData.save();

    res.send("Connection request sent successfully");
  }
  catch (err) {
    res.status(500).send(err.message);
  }
})


requestRouter.post("/request/review/:status/:connectionRequestId", userAuth, async (req, res) => {
  const userId = req.user._id;
  const { status, connectionRequestId } = req.params;
  const allowedStatuses = ["accepted", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value " + status });
  };

  try {
    const connectionRequest = await ConnectionRequest.findById({
      _id: connectionRequestId,
      receiverId: userId,
      status: "interested"
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).json({ message: `Connection request ${status} successfully.` });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = requestRouter;
