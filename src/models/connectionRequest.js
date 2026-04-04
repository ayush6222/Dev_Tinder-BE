const mongoose = require("mongoose");
const validator = require("validator");


const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        }
    }
}, { timestamps: true })

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
        throw new Error("Sender and receiver cannot be the same user.");
    }   
})

const ConnectionRequest = mongoose.model("connectionRequests", connectionRequestSchema);

module.exports = {
    ConnectionRequest
}
