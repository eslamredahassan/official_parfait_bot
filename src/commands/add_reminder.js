const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const fs = require("fs");

// Database Schemas
const Reminders = require("../../src/database/models/reminder");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "add_reminder") {
      const text = interaction.options.getString("text");
      const time = interaction.options.getString("time");
      const timeUnit = interaction.options.getString("type");

      let reminderTime;

      // Convert time to milliseconds based on the specified unit
      switch (timeUnit) {
        case "minutes":
          reminderTime = Date.now() + parseInt(time) * 60 * 1000;
          break;
        case "hours":
          reminderTime = Date.now() + parseInt(time) * 60 * 60 * 1000;
          break;
        case "days":
          reminderTime = Date.now() + parseInt(time) * 24 * 60 * 60 * 1000;
          break;
        case "weeks":
          reminderTime = Date.now() + parseInt(time) * 7 * 24 * 60 * 60 * 1000;
          break;
        case "months":
          reminderTime = new Date();
          reminderTime.setMonth(reminderTime.getMonth() + parseInt(time));
          reminderTime = reminderTime.getTime();
          break;
        default:
          // Handle unsupported units or defaults to minutes
          reminderTime = Date.now() + parseInt(time) * 60 * 1000;
          break;
      }

      // Save reminder to the database
      await Reminders.create({
        userId: interaction.user.id,
        message: text,
        time: reminderTime,
      });

      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.lastUpdate} Reminder`)
            .setDescription(
              `${
                emojis.threadMark
              } I will remind you of \`\`${text}\`\` <t:${Math.floor(
                reminderTime / 1000,
              )}:R>.`,
            ),
        ],
        ephemeral: true,
      });
    }
  });
};
