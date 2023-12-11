const mongoose = require("mongoose");

const InterfaceSchema = new mongoose.Schema({
  channelId: String,
  embedIds: String, // Array to store embed IDs
});

const Interface = mongoose.model("Interface", InterfaceSchema);

module.exports = Interface;
