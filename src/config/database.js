const mongoose = require('mongoose');


const connectDB = async () => {

    await mongoose.connect('mongodb+srv://ayush6222:ayush1907@ayushnodelearning.okfrqtn.mongodb.net/devTinder')
}


module.exports = {connectDB}