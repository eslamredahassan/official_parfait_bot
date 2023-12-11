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
    if (
      interaction.isCommand() &&
      interaction.commandName === "remove_reminder"
    ) {
      try {
        await interaction.deferReply({ ephemeral: true });
        const reminderText = interaction.options.getString("text");
        const userId = interaction.user.id;

        // Find reminders that match the user ID and contain the provided text (case-insensitive)
        const matchingReminders = await Reminders.find({
          userId,
          message: { $regex: new RegExp(reminderText, "i") },
        });

        if (matchingReminders.length > 0) {
          const removedReminders = [];

          // Loop through matching reminders and check if the user is the owner
          for (const reminder of matchingReminders) {
            if (reminder.userId === userId) {
              // If the user is the owner, remove the reminder
              await Reminders.findByIdAndRemove(reminder._id);
              removedReminders.push(reminder);
            }
          }

          if (removedReminders.length > 0) {
            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.check} Successfully Removed`,
                  description: `${emojis.threadMark} Successfully removed \`\`${removedReminders.length}\`\` matching reminders.`,
                  color: color.gray,
                },
              ],
              ephemeral: true,
            });
          }
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[32m Removed: ${removedReminders.length} reminders`,
          );
        } else {
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.warning} No Reminders Found`,
                description: `${emojis.threadMark} No reminders found containing \`\`${reminderText}\`\``,
                color: color.gray,
              },
            ],
            ephemeral: true,
          });
        }
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error removing reminder:`,
          `\x1b[34m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Error`,
              description: `${emojis.threadMark} An error occurred while removing the reminder.`,
              color: color.gray,
            },
          ],
          ephemeral: true,
        });
      }
    }
  });
};
