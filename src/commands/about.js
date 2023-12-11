const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const os = require("os");
const fs = require("fs");
const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const packageJSON = require("../../package");
const responses = require("../assest/responses.js");
const interface = require("../assest/interface.js");
const fieldsText = require("../assest/fieldsText.js");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName == "about") {
      console.log(
        `\x1b[0m`,
        `\x1b[31m 〢`,
        `\x1b[33m ${moment(Date.now()).format("lll")}`,
        `\x1b[34m ${interaction.user.username} USED`,
        `\x1b[35m About Command`,
      );

      function uptimeString(seconds) {
        let days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        let hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return `\`\`${days}\`\` Days, \`\`${hours}\`\` Hours, \`\`${minutes}\`\` Minutes, and \`\`${seconds}\`\` seconds`;
      }

      const aboutParfait = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle("LINK")
          .setLabel(`⠀Contact with IEgyGamerI`)
          .setURL(`https://discordapp.com/users/123788535324082178`)
          .setEmoji(emojis.discord),
        new MessageButton()
          .setStyle("LINK")
          .setLabel(`⠀Parfait Status⠀`)
          .setURL(`https://gfs8gj-3001.csb.app/status/parfait`)
          .setEmoji(emojis.dev),
      ]);

      await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.alert} About ${client.user.tag}`)
            .setDescription(interface.aboutMessage)
            .setThumbnail(Logo)
            .setImage(banners.aboutBanner)
            .addFields(
              {
                name: `${emojis.developer} Programmed by`,
                value: fieldsText.programed,
                inline: true,
              },
              {
                name: `${emojis.build} Build`,
                value: fieldsText.build,
                inline: true,
              },
              {
                name: `${emojis.version} Version`,
                value: fieldsText.version,
                inline: true,
              },
              {
                name: `${emojis.time} Uptime`,
                value: `${emojis.threadMark} ${uptimeString(
                  Math.floor(process.uptime()),
                )}`,
                inline: true,
              },
              {
                name: `${emojis.order} Order one for your server`,
                value: fieldsText.contact,
                inline: false,
              },
            )
            .setFooter({
              ///text: `This is for Staff members only, no one else can see it`,
              text: `Parfait - Advanced Discord Application Bot`,
              iconURL: banners.parfaitIcon,
            }),
        ],
        ephemeral: true,
        components: [aboutParfait],
      });
    }
  });
};
