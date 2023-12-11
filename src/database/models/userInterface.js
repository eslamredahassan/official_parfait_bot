const mongoose = require("mongoose");

// Create a schema for the UI data
const InterfaceSchema = new mongoose.Schema({
  embedId: String,
  channelId: String,
  guildId: String,
  status: String,
});

// Create a model using the schema
const Interface = mongoose.model("Interface", InterfaceSchema);

module.exports = Interface;
