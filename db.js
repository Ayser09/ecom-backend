const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config(); // If you're using the dotenv package

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB".bgRed.white);
  } catch (error) {
    console.log(`DB connect Error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
