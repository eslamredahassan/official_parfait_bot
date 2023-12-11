const mongoose = require("mongoose");

const CooldownSchema = new mongoose.Schema({
  username: String,
  userId: String,
  guildId: String,
  roleId: String,
  expiry: Date,
  reason: String,
  staff: String,
});

const Cooldown = mongoose.model("Cooldown", CooldownSchema);

module.exports = Cooldown;
