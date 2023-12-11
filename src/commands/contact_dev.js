const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
require("moment-duration-format");

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "contact_dev") {
      console.log(
        `\x1b[0m`,
        `\x1b[31m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[34m ${interaction.user.username} USED`,
        `\x1b[35m Message Dev Command`,
      );
      //// Modal application code ///
      let sendToDev_modal = new Modal()
        .setTitle(`📧 Send a message to the developer`)
        .setCustomId(`sendToDev_modal`);

      const message = new TextInputComponent()
        .setCustomId("user_message")
        .setLabel(`Message`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(365)
        .setRequired(true)
        .setPlaceholder(`Type your message here`)
        .setStyle(2);

      let row_usermessage = new MessageActionRow().addComponents(message);
      sendToDev_modal.addComponents(row_usermessage);
      await interaction.showModal(sendToDev_modal);
    }

    if (interaction.customId === "sendToDev_modal") {
      let message = interaction.fields.getTextInputValue("user_message");

      let dmDevChannel = client.channels.cache.get(config.dmDevChannel);
      if (!dmDevChannel) return;

      const reply = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle(2)
          .setCustomId("#profile")
          .setLabel(`Reply ${interaction.user.username}`)
          .setEmoji(emojis.dm),
      ]);
      /// Embed of data in review room ///
      await dmDevChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.newMail} **New Message**`)
            .setDescription(``)
            //.setThumbnail(banners.newMessageBanner)
            .setImage(banners.newMessageBanner)
            .addFields(
              {
                name: `${emojis.id} Sender`,
                value: `${emojis.threadMark} ${interaction.user}`,
                inline: true,
              },
              {
                name: `${emojis.time} Sent Since`,
                value: `${emojis.threadMark} <t:${Math.floor(
                  Date.now() / 1000,
                )}:R>`,
                inline: true,
              },
              {
                name: `${emojis.email} Message Content`,
                value: `${emojis.threadMark} ${message}`,
                inline: false,
              },
            )
            .setTimestamp()
            .setFooter({
              text: interaction.user.id,
              iconURL: banners.parfaitIcon,
            }),
        ],
        components: [reply],
      });

      await interaction.reply({
        embeds: [
          {
            title: `${emojis.check} Your message sent has been sent to my developer`,
            description: `- Thank you ${interaction.user} Your message will be answered soon if necessary`,
            color: color.gray,
            ///thumbnail: { url: 'https://i.imgur.com/FiSTCop.png', },
            image: { url: banners.channelMessageBanner },
          },
        ],
        //this is the important part
        ephemeral: true,
        components: [],
      });
    }
  });
};
