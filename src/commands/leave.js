const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");
const moment = require("moment");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    let guild = client.guilds.cache.get(config.guildID);

    if (interaction.isCommand() && interaction.commandName === "leave") {
      await interaction.deferReply({ ephemeral: true });

      const perms = [`${config.devRole}`];
      let staff = guild.members.cache.get(interaction.user.id);
      if (staff.roles.cache.hasAny(...perms)) {
        const serverId = interaction.options.getString("server_id");

        // Check if the provided server ID is valid
        const targetGuild = client.guilds.cache.get(serverId);
        if (!targetGuild) {
          await interaction.editReply({
            content: "Invalid server ID. Please provide a valid server ID.",
            ephemeral: true,
          });
          return;
        }

        // Confirmation message with buttons
        const confirmationEmbed = new MessageEmbed()
          .setColor(color.gray)
          .setTitle(`${emojis.parfaitIcon} ${client.user.username}`)
          .setDescription(
            `${emojis.threadMark} Leave the server with ID: ${serverId}`,
          )
          .setFooter({ text: "Confirm or cancel the action" });

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("#confirm_leave")
            .setLabel("Confirm")
            .setStyle(2)
            .setEmoji(emojis.check),
          new MessageButton()
            .setCustomId("#cancel_leave")
            .setLabel("Cancel")
            .setStyle(2)
            .setEmoji(emojis.cross),
        );

        // Send the confirmation embed with buttons
        await interaction.editReply({
          embeds: [confirmationEmbed],
          components: [row],
          ephemeral: true,
        });

        // Handle button interactions
        const filter = (button) => button.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 1 * 60 * 1000, // 15 seconds timeout
        });

        collector.on("collect", async (button) => {
          // Handle button clicks
          if (button.customId === "#confirm_leave") {
            // Leave the server
            await targetGuild.leave();

            // Send a final confirmation message
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(`${emojis.parfaitIcon} ${client.user.username}`)
                  .setDescription(
                    `${emojis.check} Left the server with ID: ${serverId}`,
                  ),
              ],
              ephemeral: true,
              components: [],
            });
          } else if (button.customId === "#cancel_leave") {
            // Cancel the action
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(`${emojis.parfaitIcon} ${client.user.username}`)
                  .setDescription(`${emojis.cross} Action canceled`),
              ],
              ephemeral: true,
              components: [],
            });
          }
        });

        // Handle the end of the button collector
        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            // If the collector times out, disable the buttons
            interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(`${emojis.parfaitIcon} ${client.user.username}`)
                  .setDescription(`${emojis.warning} Timeout. Action canceled`),
              ],
              ephemeral: true,
              components: [],
            });
          }
        });
      } else {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.cross} Permission denied`)
              .setDescription(
                `${emojis.threadMark} You don't have permission to use this command.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
