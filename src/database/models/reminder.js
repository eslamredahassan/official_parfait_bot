const mongoose = require("mongoose");

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  userId: String,
  time: Date,
  message: String,
});

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
