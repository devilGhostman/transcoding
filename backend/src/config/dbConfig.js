const mongoose = require("mongoose");

async function connectDatabse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("============= Db Connected");
  } catch (error) {
    console.error("Error ============ ON DB Connection");
    console.log(error);
  }
}

module.exports = {
  connectDatabse,
};
