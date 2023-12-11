const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  title: String,
  question: String,
  options: [String],
  votes: [String],
  expire: Date,
  channel: String,
  pollId: String,
  createdBy: String,
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
