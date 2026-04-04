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


const validateUpdateData = (data) => {
    const allowedEditFields = ["firstName", "lastName", "skills", "shortDesc"];
    const isValidUpdate = Object.keys(data).every((key) => allowedEditFields.includes(key));
    if(data.skills && data.skills.length > 10){
        return {isValid: false, message: "Skills cannot have more than 10 items."};
    }   
    if (!isValidUpdate) {
        return {isValid: false, message: "Invalid updates! Only firstName, lastName, skills and shortDesc can be updated."};
    }
    return {isValid: true};
}

const validatePasswordResetData = (data) => {
    const {oldPassword, newPassword} = data;
    if(!validator.isStrongPassword(newPassword, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
        return {isValid: false, message: "New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol."};
    }
    return {isValid: true};
}

module.exports = {validateSignupData, validateUpdateData, validatePasswordResetData}
