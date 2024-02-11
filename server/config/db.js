const mongoose = require("mongoose");
const colors = require("colors")

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb Connected : ${connect.connection.host}`.yellow);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
