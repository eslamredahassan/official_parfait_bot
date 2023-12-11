const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const Cooldown = require("../../../src/database/models/CooldownModel");
const color = require("../../../src/assest/color.js");
const emojis = require("../../../src/assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isCommand() &&
      interaction.commandName === "check_cooldown"
    ) {
      await interaction.deferReply({ ephemeral: true });
      const member = interaction.options.getUser("member");
      const memberTarget = interaction.guild.members.cache.get(member.id);

      const perms = [config.devRole, config.devRoleTest];
      const staff = guild.members.cache.get(interaction.user.id);

      if (staff.roles.cache.hasAny(...perms)) {
        try {
          const Cooldown = await Cooldown.findOne({
            userId: member.id,
          });

          if (Cooldown) {
            const expiryDate = Cooldown.expiry;
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(`${emojis.cooldown} Checking Cooldown Duration`)
                  .setDescription(
                    `${emojis.threadMark} The cooldown of ${
                      memberTarget.user
                    } will ends <t:${Math.floor(expiryDate / 1000)}:R>`,
                  ),
              ],
              ephemeral: true,
            });
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m ${memberTarget.user.username}`,
              `\x1b[32m Checked cooldown of`,
              `\x1b[35m ${memberTarget.user.username}`,
              `\x1b[33m that ends ${moment(expiryDate).fromNow()}`,
            );
          } else {
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(`${emojis.cooldown} Checking Cooldown Duration`)
                  .setDescription(
                    `${emojis.threadMark} ${memberTarget} does not have any cooldown`,
                  ),
              ],
              ephemeral: true,
            });
          }
        } catch (error) {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${memberTarget.user.username}`,
            `\x1b[32m Error checking cooldown duration:`,
            `\x1b[35m ${error.message}`,
          );
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.cooldown} Checking Cooldown Duration`)
                .setDescription(
                  `${emojis.threadMark} An error occurred while checking the cooldown duration.`,
                ),
            ],
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Permission Denied`)
              .setDescription(
                `${emojis.threadMark} You don't have the required permissions to check cooldowns.`,
              ),
          ],
          ephemeral: true,
        });
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Permission denied`,
        );
      }
    }
  });
};
