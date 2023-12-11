const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "report_bug") {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("lll")}`,
        `\x1b[31m ${interaction.user.username} USED`,
        `\x1b[35m Report Bug Command`,
      );
      //// Modal application code ///
      let report_modal = new Modal()
        .setTitle(`🐞 Report bug`)
        .setCustomId(`report_modal`);

      const where = new TextInputComponent()
        .setCustomId("bug_where")
        .setLabel(`Which bug you want to report?`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(65)
        .setRequired(true)
        .setPlaceholder(`Name the bug or say where you found it`)
        .setStyle(1);
      const details = new TextInputComponent()
        .setCustomId("bug_details")
        .setLabel(`Type details about this bug`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(365)
        .setRequired(true)
        .setPlaceholder(`Type the details here `)
        .setStyle(2);

      let row_where = new MessageActionRow().addComponents(where);
      let row_details = new MessageActionRow().addComponents(details);
      report_modal.addComponents(row_where, row_details);
      await interaction.showModal(report_modal);
    }

    if (interaction.customId === "report_modal") {
      let where = interaction.fields.getTextInputValue("bug_where");
      let details = interaction.fields.getTextInputValue("bug_details");

      let reportBugChannel = client.channels.cache.get(config.reportBugChannel);
      if (!reportBugChannel) return;

      const reply = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle(2)
          .setCustomId("#profile")
          .setLabel(`Reply ${interaction.user.username}`)
          .setEmoji(emojis.dm),
      ]);

      /// Embed of data in review room ///
      await reportBugChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.log} **Bug report**`)
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(``)
            //.setThumbnail( interaction.user.displayAvatarURL() )
            .setImage(banners.channelBugBanner)
            .addFields([
              {
                name: `${emojis.id} Reported by`,
                value: `${emojis.threadMark} ${interaction.user}`,
                inline: true,
              },
              {
                name: `${emojis.time} Reported Since`,
                value: `${emojis.threadMark} <t:${Math.floor(
                  Date.now() / 1000,
                )}:R>`,
                inline: true,
              },
              {
                name: `${emojis.bug} Founded in`,
                value: `${emojis.threadMark} ${where}`,
                inline: false,
              },
              {
                name: `${emojis.reason} Bug details`,
                value: `${emojis.threadMark} ${details}`,
                inline: false,
              },
            ])
            .setTimestamp()
            .setFooter({
              text: interaction.user.id,
              iconURL: banners.parfaitIcon,
            }),
        ],
        components: [reply],
      });

      return await interaction.reply({
        embeds: [
          {
            title: `${emojis.check} Your report has been sent to the developer`,
            description: `- Thank you ${interaction.user} for report this bug\n- We are also sorry to make you encounter this bug and we will work to fix it as soon as possible`,
            color: color.gray,
            ///thumbnail: { url: 'https://i.imgur.com/FiSTCop.png', },
            image: { url: banners.reportBugBanner },
          },
        ],
        //this is the important part
        ephemeral: true,
        components: [],
      });
    }
  });
};
