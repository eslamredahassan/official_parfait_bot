const moment = require("moment");

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

const Cooldown = require("../../src/database/models/CooldownModel");

module.exports = async (client, config) => {
  const checkExpiredRoles = async () => {
    try {
      const currentTime = new Date();
      const expiredRoles = await Cooldown.find({
        expiry: { $lt: currentTime },
      });

      for (const role of expiredRoles) {
        const guild = client.guilds.cache.get(role.guildId);
        if (!guild) continue;

        let member;
        try {
          member = await guild.members.fetch(role.userId);
        } catch (error) {
          console.error(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error fetching member:`,
            `\x1b[34m ${error.message}`,
          );
          continue;
        }

        // Role removal logic whether or not the role is present
        try {
          await member.roles.remove(role.roleId);
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${member.user.username}`,
            `\x1b[32m Finished his cooldown`,
          );

          await member.send({
            embeds: [
              {
                title: `${emojis.check} Expired Cooldown period`,
                description: `${emojis.threadMark} Your cooldown period has ended. Feel free to reapply again.`,
                color: color.gray,
                timestamp: new Date(),
                footer: {
                  text: "Finished in",
                  icon_url: banners.parfaitIcon,
                },
              },
            ],
            ephemeral: false,
          });

          const channel = guild.channels.cache.get(config.log);
          if (channel && channel.isText()) {
            await channel.send({
              embeds: [
                {
                  title: `${emojis.log} Cooldown Log`,
                  description: `${emojis.threadMark} ${member.user} Finished his cooldown period`,
                  color: color.gray,
                  timestamp: new Date(),
                  footer: {
                    text: "Finished in",
                    icon_url: banners.parfaitIcon,
                  },
                },
              ],
              ephemeral: false,
            });
          }

          await Cooldown.deleteOne({ _id: role._id });
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${member.user.username} Cooldown entry`,
            `\x1b[31m Removed`,
          );
        } catch (error) {
          console.error(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error removing ${role.name} role or entry:`,
            `\x1b[34m ${error.message}`,
          );
        }
      }
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error checking expired cooldown entries:`,
        `\x1b[34m ${error.message}`,
      );
    }
  };

  // Run this function every 5 seconds
  setInterval(checkExpiredRoles, 5 * 1000); // 5 seconds
};
