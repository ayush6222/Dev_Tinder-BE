const mongoose = require('mongoose');
const validator = require('validator');
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format" + value);
            }
        }
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
                throw new Error("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.");
            }
        }
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