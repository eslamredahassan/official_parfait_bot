const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const fs = require("fs");

// Database Schemas
const Application = require("../../src/database/models/application");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "squad_sun") {
      await interaction.deferReply({ ephemeral: true });
      try {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${interaction.user.username}`,
          `\x1b[34m USED`,
          `\x1b[35m Squad Sun`,
        );
        const squad = interaction.guild.roles.cache.get(config.SquadSUN);

        const membersWithRole = [];
        for (const member of squad.members.values()) {
          const applicationData = await Application.findOne({
            userId: member.id,
          });

          const userCode = applicationData ? applicationData.user_code : "N/A";
          const emoji =
            member === squad.members.last()
              ? emojis.threadMark
              : emojis.threadMarkmid;

          membersWithRole.push(
            `${emoji} ${member.user} ${emojis.pinkDot} Smash Code: \`\`${userCode}\`\``,
          );
        }

        const squadSun = membersWithRole.join("\n");

        const embed = new MessageEmbed()
          .setTitle(``)
          .setDescription(`### ${emojis.sunL} Squad SUN\n` + squadSun)
          //.setThumbnail(Logo)
          .setColor(color.gray)
          .setImage(banners.list)
          .setFooter({
            text: "Total Sun Members: " + `${squad.members.size} Members`,
            iconURL: banners.parfaitIcon,
          });

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m An Error Occurred in Squad Sun Command:`,
          `\x1b[35m ${error.message}`,
        );
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Error`)
              .setDescription(
                `${emojis.cross} Something wrong happened while processing your request.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
