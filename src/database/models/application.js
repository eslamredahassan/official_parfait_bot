const mongoose = require("mongoose");

// Create a schema for the application data
const ApplicationSchema = new mongoose.Schema({
  userId: String,
  username: String,
  user_code: String,
  user_age: Number,
  user_ct: String,
  user_legends: String,
  user_why: String,
  application: String,
  thread: String,
  status: String,
  createdIn: {
    type: Date,
    default: Date.now, // Set a default value to the current date
  },
});

// Create a model using the schema
const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
