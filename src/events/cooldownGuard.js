const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const Cooldown = require("../../src/database/models/CooldownModel");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  // Function to reapply temporary roles for rejoining members
  const reapplyCooldowns = async () => {
    try {
      const currentTime = new Date();
      const guild = client.guilds.cache.get(config.guildID);
      if (!guild) return;

      const allMembers = await guild.members.fetch();

      for (const [memberId, member] of allMembers) {
        const existingRoles = await Cooldown.find({
          userId: memberId,
          expiry: { $gt: currentTime },
        });

        for (const role of existingRoles) {
          const roleId = role.roleId;
          const roleData = await guild.roles.fetch(roleId);
          const expiry = role.expiry;

          if (member && member.manageable && member.roles) {
            if (!member.roles.cache.has(roleId)) {
              try {
                await member.roles.add(roleId);
                console.log(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m ${roleData.name}`,
                  `\x1b[32m Reassigned to ${member.user.username}`,
                );
                await member.send({
                  embeds: [
                    new MessageEmbed()
                      .setColor(color.gray)
                      .setTitle(`${emojis.warning} Warning!`)
                      .setDescription(
                        `${emojis.threadMark} You are still in the cooldown period, so you will continue the period`,
                      )
                      .addFields({
                        name: `${emojis.lastUpdate} Your Cooldown Duration Ends`,
                        value: `${emojis.threadMark} <t:${Math.floor(
                          expiry / 1000,
                        )}:R>`,
                        inline: false,
                      }),
                  ],
                });
              } catch (error) {
                console.error(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Error reassigning ${roleData.name} role:`,
                  `\x1b[34m ${error.message}`,
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error reapplying temporary roles:`,
        `\x1b[34m ${error.message}`,
      );
    }
  };

  // Run the function every hour (adjust as needed)
  setInterval(reapplyCooldowns, 5 * 1000); // 60 minutes

  // Other code
};
