const Reminder = require("../../src/database/models/reminder");
const moment = require("moment");

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  setInterval(async () => {
    const currentTime = new Date();
    const reminders = await Reminder.find({ time: { $lte: currentTime } });

    reminders.forEach(async (reminder) => {
      try {
        // Fetch user and send the reminder message (in this case, via DM)
        const user = await client.users.fetch(reminder.userId);
        if (user) {
          await user.send({
            embeds: [
              {
                title: `${emojis.lastUpdate} Reminder`,
                description: `${emojis.threadMark} You asked me to remind you of \`\`${reminder.message}\`\``,
                color: color.gray,
                timestamp: new Date(),
                footer: {
                  text: "Reminded in",
                  icon_url: client.user.displayAvatarURL({ dynamic: true }),
                },
              },
            ],
            // this is the important part
            ephemeral: false,
          });
        }

        // Once the reminder is sent, remove it from the database
        await Reminder.findByIdAndDelete(reminder._id);
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error sending reminder:`,
          `\x1b[34m ${error.message}`,
        );
      }
    });

    // Remove reminders for users who left the server
    const allMembers = await client.guilds.cache
      .get(config.guildID)
      .members.fetch();

    for (const [memberId, member] of allMembers) {
      if (!member) {
        // The member is not in the server anymore, so remove their reminders
        await Reminder.deleteMany({ userId: memberId });
      }
    }
  }, 5 * 1000); // Check every minute
};
