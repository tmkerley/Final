const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DATABASE_URI, {
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;