const mongoose = require("mongoose");

async function getConnect() {
  try {
    // await mongoose.connect("mongodb+srv://vaanchal05:Aanchal97@cluster0.3vwayor.mongodb.net/express-crud?retryWrites=true&w=majority");
    await mongoose.connect("mongodb://localhost:27017/expresssCrud");
    console.log("Database is Connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = getConnect;
