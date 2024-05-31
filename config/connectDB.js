const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // console.log(process.env.PORT);
    await mongoose.connect("mongodb+srv://aatish:atish.tech@realtimechatappdb.5xmnrv8.mongodb.net/paytm-clone");
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error, "MongoDB is not connected");
  }
}; 

module.exports = connectDB;