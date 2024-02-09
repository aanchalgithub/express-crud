const mongoose = require("mongoose");

async function getConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/CRUD-express");
    console.log("Database is Connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = getConnect;
