// Create a Mongoose model for the counter
const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", CounterSchema);

module.exports = Counter;
