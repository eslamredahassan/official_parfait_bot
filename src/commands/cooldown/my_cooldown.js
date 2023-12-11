const moment = require("moment");
const Cooldown = require("../../../src/database/models/CooldownModel");

const banners = require("../../assest/banners.js");
const errors = require("../../assest/errors.js");
const color = require("../../assest/color.js");
const emojis = require("../../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "my_cooldown") {
      const guild = interaction.guild;
      const member = guild.members.cache.get(interaction.user.id);

      await interaction.deferReply({ ephemeral: true });

      try {
        const cooldown = await Cooldown.findOne({
          userId: member.id,
        });
        if (!cooldown) {
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.cooldown} Cooldown`,
                description: `${emojis.threadMark} You're not in a cooldown duration.`,
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [],
          });
          return;
        }

        const roleExpiry = cooldown.expiry;
        if (roleExpiry <= 0) {
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.cooldown} Great News!`,
                description: `${emojis.threadMark} Your cooldown duration has been finished.`,
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [],
          });
          return;
        }
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.cooldown} Checking cooldown duration`,
              description: `${
                emojis.threadMark
              } Your cooldown duration ends in <t:${Math.floor(
                roleExpiry / 1000,
              )}:R> ${emojis.pinkDot} <t:${Math.floor(roleExpiry / 1000)}:f>`,
              color: color.gray,
            },
          ],
          ephemeral: true,
          components: [],
        });
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${interaction.user.username}`,
          `\x1b[32m Checked his cooldown duration`,
          `\x1b[33m that ends ${moment(roleExpiry).fromNow()}`,
        );
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error checking cooldown left:`,
          `\x1b[34m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Error`,
              description: `${emojis.threadMark} An error occurred while checking the time for your cooldown.`,
              color: color.gray,
            },
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
