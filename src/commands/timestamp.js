const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const moment = require("moment");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "timestamp") {
      await interaction.deferReply({ ephemeral: true });

      let guild = client.guilds.cache.get(config.guildID);
      const perms = [
        `${config.devRole}`,
        `${config.STAFF}`,
        `${config.staffSun}`,
        `${config.SquadSUN}`,
        `${config.SunTest}`,
        `${config.TeamSun}`,
      ];
      let user = guild.members.cache.get(interaction.user.id);
      if (user.roles.cache.hasAny(...perms)) {
        try {
          const year = Math.floor(interaction.options.getInteger("year")) || 0;
          const month =
            Math.floor(interaction.options.getInteger("month")) || 0;
          const day = Math.floor(interaction.options.getInteger("day")) || 0;
          const hour = Math.floor(interaction.options.getInteger("hour")) || 0;
          const minute =
            Math.floor(interaction.options.getInteger("minute")) || 0;
          const second =
            Math.floor(interaction.options.getInteger("second")) || 0;
          let type = interaction.options.getString("type") || "R"; // Default type is R

          // Valid types: "t, T, d, D, f, F, R"
          const validTypes = ["t", "T", "d", "D", "f", "F", "R"];

          // If the provided type is not in the valid types, default to "R"
          if (!validTypes.includes(type.toUpperCase())) {
            type = "R";
          }

          // Check if the user chose a type but didn't provide any time or date
          if (
            year === 0 &&
            month === 0 &&
            day === 0 &&
            hour === 0 &&
            minute === 0 &&
            second === 0 &&
            ["t", "T"].includes(type.toUpperCase())
          ) {
            const noTimeDateEmbed = new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} No Date or Time Provided`)
              .setDescription(
                `${emojis.threadMark} Please provide a valid date and time.`,
              );
            return interaction.editReply({
              embeds: [noTimeDateEmbed],
              ephemeral: true,
            });
          }

          // Check if the user chose a type requiring time, but didn't provide a valid time
          if (
            ["t"].includes(type.toUpperCase()) &&
            hour === 0 &&
            minute === 0
          ) {
            const embed = new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.cross} Time Not Provided`)
              .setDescription(
                `${emojis.threadMark} Please provide a valid time for type hh:mm AM/PM.`,
              );
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          }
          if (
            ["T"].includes(type.toUpperCase()) &&
            hour === 0 &&
            minute === 0
          ) {
            const embed = new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.cross} Time Not Provided`)
              .setDescription(
                `${emojis.threadMark} Please provide a valid time for type hh:mm:ss AM/PM.`,
              );
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          }

          const targetDate = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second,
          );

          if (isNaN(targetDate.getTime())) {
            throw new Error("Invalid date provided");
          }

          let timestamp;

          timestamp = `<t:${Math.floor(targetDate.getTime() / 1000)}:${type}>`;

          const embed = new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.check} Generated Timestamp`)
            .setDescription(
              `${emojis.threadMark} ${interaction.user}, here is your generated timestamp.`,
            )
            .setThumbnail(banners.timestampImage)
            .addFields(
              {
                name: `${emojis.lastUpdate} Review`,
                value: `${emojis.threadMark} ${timestamp}`,
                inline: false,
              },
              {
                name: `${emojis.time} Timesamp code`,
                value: `${emojis.threadMark} \`\`${timestamp}\`\``,
                inline: false,
              },
            );

          await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          console.error(
            `\x1b[0m`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in timestamp command:`,
            `\x1b[34m ${error.message}`,
          );
          const errorEmbed = new MessageEmbed()
            .setColor(color.gray)
            .setDescription(
              `${emojis.warning} An error occurred while processing the command.`,
            );
          await interaction.editReply({
            embeds: [errorEmbed],
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.alert} Permission denied`,
              description: `${emojis.threadMark} You don't have permission to use </timestamp:1185068499903717457> command.`,
              color: color.gray,
            },
          ],
          //this is the important part
          ephemeral: true,
        });
      }
    }
  });
};
