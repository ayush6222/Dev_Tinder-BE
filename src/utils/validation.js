const validator = require("validator");

const validateSignupData = (data) => {
    const {firstName, emailId, password} = data;
    if(!firstName || !emailId || !password){
        return {isValid: false, message: "First name, email and password are required."};
    }
    else if(!validator.isEmail(emailId)){
        return {isValid: false, message: "Invalid email format."};
    }
    else if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
        return {isValid: false, message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol."};
    }
    return {isValid: true};
}

module.exports = {validateSignupData}