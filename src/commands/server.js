const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const moment = require("moment");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "server") {
      await interaction.deferReply({ ephemeral: true });

      const perms = [`${config.devRole}`];
      let staff = guild.members.cache.get(interaction.user.id);
      if (staff.roles.cache.hasAny(...perms)) {
        // Convert the guilds iterator to an array
        const guilds = Array.from(client.guilds.cache.values());

        let guildsString = "";
        for (let i = 0; i < guilds.length; i++) {
          const guild = guilds[i];
          const threadMark =
            i === guilds.length - 1 ? emojis.threadMark : emojis.threadMarkmid;
          guildsString += `${threadMark} ${guild.name} ${emojis.pinkDot} \`\`${guild.id}\`\`\n`;
        }

        // Respond with the list of guilds
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setDescription(
                `### ${emojis.parfaitIcon} ${client.user.username} is in the following guilds:\n${guildsString}`,
              )
              .setImage(banners.aboutBanner)
              .setFooter({
                text: `Parfait - Advanced Discord Application Manager Bot`,
                iconURL: banners.parfaitIcon,
              }),
          ],
          ephemeral: true,
          components: [],
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
