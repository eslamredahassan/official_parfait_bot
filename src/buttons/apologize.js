const {
  MessageActionRow,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");

const messages = require("../assest/messages.js");
const banners = require("../assest/banners.js");
const errors = require("../assest/errors.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

// Database Schemas
const Application = require("../../src/database/models/application");
const Cooldown = require("../../src/database/models/CooldownModel");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    try {
      if (interaction.isButton() && interaction.customId === "#ap_apologize") {
        const ID = interaction.message.embeds[0].footer.text;
        const user = await interaction.guild.members.fetch(ID);

        //// Modal application code ///
        let reply_modal = new Modal()
          .setTitle(`Apologize to ${user.user.username}`)
          .setCustomId(`ap_apologize`);

        const ap_reason = new TextInputComponent()
          .setCustomId("ap_reason")
          .setLabel(`Apologize Message`.substring(0, 45))
          .setMinLength(1)
          .setMaxLength(365)
          .setRequired(false)
          .setPlaceholder(`Type your apologize message here or leave it empty.`)
          .setStyle(2);

        let row_reply = new MessageActionRow().addComponents(ap_reason);
        reply_modal.addComponents(row_reply);

        const perms = [`${config.devRole}`, `${config.STFF}`];
        let staff = guild.members.cache.get(interaction.user.id);
        if (staff.roles.cache.hasAny(...perms)) {
          await interaction.showModal(reply_modal);
        } else {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Permission denied`,
          );
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.warning} Permission denied`,
                description: errors.permsError,
                color: color.gray,
              },
            ],
            ephemeral: true,
          });
        }
      }
      //// Send application results in review room ////
      if (interaction.customId === "ap_apologize") {
        await interaction.deferReply({ ephemeral: true });
        let reason = interaction.fields.getTextInputValue("ap_reason");

        /// Embed of data in review room ///
        const ID = interaction.message.embeds[0].footer.text;
        const ap_user = await interaction.guild.members.fetch(ID);

        let embed = new MessageEmbed(interaction.message.embeds[0])
          .setTitle(
            `${emojis.alert} Apologized by ${interaction.user.username}`,
          )
          .setColor(color.gray)
          .setImage(banners.apologizeBanner)
          .setThumbnail(banners.apologizeIcon)
          .setTimestamp();

        await interaction.message
          .edit({
            embeds: [embed],
            components: [],
          })
          .then((msg) => msg.unpin());

        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("lll")}`,
          `\x1b[34m ${ap_user.user.username}`,
          `\x1b[32m APOLOGIZED BY ${interaction.user.username}`,
        );

        const expiryInDays = 30; // Example: role expires in 2 days

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryInDays);

        const CooldownDuration = new Cooldown({
          username: ap_user.user.username,
          userId: ap_user.id,
          guildId: guild.id,
          roleId: config.coolDown,
          expiry: expiryDate,
          staff: interaction.user.username,
          reason: reason || "No reason provided",
        });
        // Save the temporary role data to the database
        await CooldownDuration.save();

        // Assign the role to the member
        await ap_user.roles.add(config.coolDown);
        await ap_user.roles.remove(config.waitRole);

        const cooldownExpiry = await Cooldown.findOne({
          userId: ap_user.id,
        });
        const cooldownTime = cooldownExpiry.expiry;
        // Send message to accepted member
        await ap_user.send({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.sad_parfait} We Apologize`)
              .setImage(banners.dmApologizeBanner)
              .setDescription(reason || messages.apologize)
              .addFields({
                name: `${emojis.time} Your cooldown ends in`,
                value: `${emojis.threadMark} <t:${Math.floor(
                  cooldownTime / 1000,
                )}:F>`,
              }),
          ],
        });
        // Send message to log chgannel
        const log = interaction.guild.channels.cache.get(config.log);
        await log.send({
          embeds: [
            {
              title: `${emojis.log} Apologize Log`,
              description: `${emojis.check} ${ap_user.user} have been apologized by ${interaction.user}`,
              color: color.gray,
              fields: [
                {
                  name: `${emojis.reason} Apologize Reason`,
                  value: reason || `No Reason Found`,
                  inline: false,
                },
                {
                  name: `${emojis.time} Cooldown Expires`,
                  value: `${emojis.threadMark} On <t:${Math.floor(
                    cooldownTime / 1000,
                  )}:F>`,
                  inline: false,
                },
              ],
              timestamp: new Date(),
              footer: {
                text: "Apologized in",
                icon_url: banners.parfaitIcon,
              },
            },
          ],
          //this is the important part
          ephemeral: false,
        });

        const applicationStatus = await Application.findOneAndUpdate({
          userId: ap_user.id,
          $set: { status: "Apologized" }, // Change "status" to the field you want to update
          new: true,
        });
        //// Interactions roles ///
        await ap_user.roles.remove([config.SunTest, config.SquadSUN]);
        //// Send message after accepting member ///
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.check} Apologize Message Sent`,
              description: `${
                emojis.threadMarkmid
              } You apologized to ${ap_user} for not being in **SUN**\n${
                emojis.threadMarkmid
              } Removed his application from pin list\n${
                emojis.threadMark
              } His cooldown ends on <t:${Math.floor(cooldownTime / 1000)}:F>`,
              color: color.gray,
            },
          ],
          //this is the important part
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in Apologize Command:`,
        `\x1b[33m ${error.message}`,
      );
      await interaction.editReply({
        embeds: [
          {
            title: `${emojis.check} Apologize Alert`,
            description: `${emojis.threadMark} An error occurred while sending your apologize message.`,
            color: color.gray,
          },
        ],
        //this is the important part
        ephemeral: true,
      });
    }
  });
};
