const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength: 3,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        trim: true,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
        min: 18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!(["male", "female", "other"].includes(value.toLowerCase()))){
                throw new Error("Gender must be either  male, female or other")
            }
        }
    },
    skills:{
        type:[String],
    },
    shortDesc:{
        type:String,
        default: "This is short description about me",
    }
}, {timestamps: true})

const User = mongoose.model("users", userSchema)

module.exports = {User}