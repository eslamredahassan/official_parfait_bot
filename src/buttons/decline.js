const {
  MessageActionRow,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);

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

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#ap_decline") {
      const ID = interaction.message.embeds[0].footer.text;
      const user = await interaction.guild.members.fetch(ID);

      //// Modal application code ///
      let reply_modal = new Modal()
        .setTitle(`Decline ${user.user.username}'s application`)
        .setCustomId(`ap_decline`);

      const ap_reason = new TextInputComponent()
        .setCustomId("ap_reason")
        .setLabel(`Decline Reason`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(365)
        .setRequired(false)
        .setPlaceholder(`Type your the reason here or leave it empty`)
        .setStyle(2);

      let row_reply = new MessageActionRow().addComponents(ap_reason);
      reply_modal.addComponents(row_reply);

      const perms = [`${config.devRole}`, `${config.STAFF}`];
      let staff = guild.members.cache.get(interaction.user.id);
      if (staff.roles.cache.hasAny(...perms)) {
        await interaction.showModal(reply_modal);
      } else {
        await interaction.reply({
          embeds: [
            {
              title: `${emojis.alert} Permission denied`,
              description: errors.permsError,
              color: color.gray,
            },
          ],
          //this is the important part
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
    //// Send application results in review room ////
    if (interaction.customId === "ap_decline") {
      try {
        await interaction.deferReply({ ephemeral: true });

        let reply = interaction.fields.getTextInputValue("ap_reason");
        /// Embed of data in review room ///
        let embed = new MessageEmbed(interaction.message.embeds[0])
          .setTitle(`${emojis.alert} Rejected by ${interaction.user.username}`)
          .setColor(color.gray)
          .setImage(banners.rejectBanner)
          .setThumbnail(banners.rejectIcon)
          .setTimestamp();
        /// Edit Review Embed ///
        interaction.message
          .edit({
            embeds: [embed],
            components: [],
          })
          .then((msg) => msg.unpin());

        //// Send message to rejected member ///
        const ID = interaction.message.embeds[0].footer.text;
        const ap_user = await interaction.guild.members.fetch(ID);

        const expiryInDays = 30; // Example: role expires in 2 days

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryInDays);

        const cooldownDuration = new Cooldown({
          username: ap_user.user.username,
          userId: ap_user.id,
          guildId: guild.id,
          roleId: config.coolDown,
          expiry: expiryDate,
          staff: interaction.user.username,
          reason: reply || "No reason provided",
        });
        await cooldownDuration.save(); // Save the temporary role data to the database

        // Assign the role to the member
        await ap_user.roles.add(config.coolDown);
        await ap_user.roles.remove(config.waitRole);

        const cooldownExpiry = await Cooldown.findOne({
          userId: ap_user.id,
        });
        const cooldownTime = cooldownExpiry.expiry;
        defaultReply = `${
          emojis.threadMarkmid
        } You can't join SUN at least for now, improve your gameplay\n ${
          emojis.threadMark
        } Your cooldown duration will end in <t:${Math.floor(
          cooldownTime / 1000,
        )}:f>`;
        await ap_user.send({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(
                `${emojis.sad_parfait} You're application has been declined`,
              )
              .setImage(banners.dmRejectBanner)
              .setDescription(
                reply
                  ? `${reply}\nYou're now in a cooldown period, you will be able to try again on <t:${Math.floor(
                      cooldownTime / 1000,
                    )}:F>`
                  : defaultReply,
              ),
          ],
        });
        /// Console Action ///
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${ap_user.user.username}`,
          `\x1b[32m DECLINED BY ${interaction.user.username}`,
        );
        //// Send message to log channel after rejecting member ///
        const log = interaction.guild.channels.cache.get(config.log);
        await log.send({
          embeds: [
            {
              title: `${emojis.log} Decline Log`,
              description: `${emojis.cross} ${ap_user.user} have been declined by ${interaction.user}`,
              color: color.gray,
              fields: [
                {
                  name: `${emojis.reason} Decline Reason`,
                  value: reply || `No Reason Found`,
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
                text: "Declined in",
                icon_url: banners.parfaitIcon,
              },
            },
          ],
          //this is the important part
          ephemeral: false,
        });

        let applyChannel = interaction.guild.channels.cache.get(
          config.applyChannel,
        );
        if (!applyChannel) return;

        const user = ap_user.user.username;

        const threadName = applyChannel.threads.cache.find(
          (x) => x.name === `${"🧤︱" + user + " Tryout"}`,
        );
        /// Rename The Thread ///
        await threadName.setName("🧤︱" + user + " Declined");
        /// Lock the thread ///
        await wait(1000); // ** cooldown 10 seconds ** \\
        await threadName.setLocked(true);
        /// Archive the thread ///
        await wait(2000); // ** cooldown 10 seconds ** \\
        await threadName.setArchived(true);
        //// Send reply message after rejecting member ///

        await Application.findOneAndUpdate({
          userId: ap_user.id,
          $set: { status: "Declined" }, // Change "status" to the field you want to update
          new: true,
        });

        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.check} Application Declined`,
              description: `${
                emojis.threadMarkmid
              } You've declined ${user} application\n${
                emojis.threadMarkmid
              } Removed his application from pin list\n${
                emojis.threadMark
              } His cooldown ends in <t:${Math.floor(cooldownTime / 1000)}:F>`,
              color: color.gray,
            },
          ],
          //this is the important part
          ephemeral: true,
        });
      } catch (error) {
        console.log(error.message);
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.alert} Something went wrong`,
              description: `${emojis.threadMark} Something went wrong while trying to decline the applications`,
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
