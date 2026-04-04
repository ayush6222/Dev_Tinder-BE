const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
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
        enum: {
            values: ["male", "female", "other"],
            message: "{VALUE} is not a valid gender"
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

userSchema.methods.getJWTToken = function(){
    const user = this;
    const token = jwt.sign({userId: this._id}, "dev_tinder_ayush", {expiresIn: "1d"});
    return token;
}

userSchema.methods.passwordMatching = async function(password){
    const user = this;
    return await bcrypt.compare(password, user.password);
}

userSchema.methods.passwordHashing = async function(password){
    return await bcrypt.hash(password, 10);
}



const User = mongoose.model("users", userSchema)

module.exports = {User}
