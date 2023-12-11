const {
  MessageActionRow,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);

const banners = require("../assest/banners.js");
const errors = require("../assest/errors.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

// Database Schemas
const Application = require("../../src/database/models/application");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    try {
      if (interaction.isButton() && interaction.customId === "#ap_freeze") {
        const ID = interaction.message.embeds[0].footer.text;
        const user = await interaction.guild.members.fetch(ID);

        let reply_modal = new Modal()
          .setTitle(`Freeze ${user.user.username}`)
          .setCustomId(`ap_freeze`);

        const ap_reason = new TextInputComponent()
          .setCustomId("ap_reason")
          .setLabel(`Freeze Reason`.substring(0, 45))
          .setMinLength(1)
          .setMaxLength(365)
          .setRequired(false)
          .setPlaceholder(`Type your reason here or leave it empty`)
          .setStyle(2);

        let row_reply = new MessageActionRow().addComponents(ap_reason);
        reply_modal.addComponents(row_reply);

        const perms = [`${config.devRole}`, `${config.STAFF}`];
        let staff = guild.members.cache.get(interaction.user.id);
        if (staff.roles.cache.hasAny(...perms)) {
          await interaction.showModal(reply_modal);
        } else {
          await interaction
            .editReply({
              embeds: [
                {
                  title: `${emojis.alert} Permission denied`,
                  description: errors.permsError,
                  color: color.gray,
                },
              ],
              ephemeral: true,
            })
            .catch(() => console.log("Error Line 185"));
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Permission denied`,
          );
        }
      }
      //// Send application results in review room ////
      if (interaction.customId === "ap_freeze") {
        await interaction.deferReply({ ephemeral: true });
        let reason = interaction.fields.getTextInputValue("ap_reason");

        /// Embed of data in review room ///
        let embed = new MessageEmbed(interaction.message.embeds[0])
          .setTitle(`${emojis.alert} Banned by ${interaction.user.username}`)
          .setColor(color.gray)
          .setImage(banners.bannedBanner)
          .setThumbnail(banners.bannedIcon)
          .setTimestamp();
        /// Edit Review Embed ///
        await interaction.message
          .edit({
            embeds: [embed],
            components: [],
          })
          .then((msg) => msg.unpin());
        //// Send message to rejected member ///
        const ID = interaction.message.embeds[0].footer.text;
        const ap_user = await interaction.guild.members.fetch(ID);
        /// Console Action ///
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${ap_user.user.username}`,
          `\x1b[32m FROZEN BY ${interaction.user.username}`,
        );
        await ap_user.send({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.freeze} Frozen`)
              .setImage(banners.bannedBanner)
              .setDescription(
                reason ||
                  `You have been frozen from applying to SUN again for breaking the rules`,
              ),
          ],
        });
        //// Send message to log channel after freezing member ///
        const log = interaction.guild.channels.cache.get(config.log);
        await log.send({
          embeds: [
            {
              title: `${emojis.log} Frozen Log`,
              description: `${emojis.snow} ${ap_user.user} have been frozen by ${interaction.user}`,
              color: color.gray,
              fields: [
                {
                  name: `${emojis.reason} Frozen Reason`,
                  value: reason || `No Reason Found`,
                  inline: false,
                },
              ],
              timestamp: new Date(),
              footer: {
                text: "Frozen in",
                icon_url: banners.parfaitIcon,
              },
            },
          ],
          //this is the important part
          ephemeral: false,
        });
        //// Try to manage his roles ///
        try {
          await ap_user.roles.remove([
            config.waitRole,
            config.SunTest,
            config.SquadSUN,
          ]);
          await ap_user.roles.add(config.banRole);
        } catch (error) {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in role management:`,
            `\x1b[33m ${error.message}`,
          );
        }
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Sun wannabe role REMOVED`,
          `\x1b[33m Freeze role ADDED`,
        );
        let applyChannel = interaction.guild.channels.cache.get(
          config.applyChannel,
        );

        const user = ap_user.user;
        const userName = user.username;

        const threadName = applyChannel.threads.cache.find(
          (x) => x.name === `${"🧤︱" + userName + " Tryout" || " Approved"}`,
        );
        if (threadName && !threadName.archived) {
          /// Rename The Thread ///
          await threadName.setName("🧤︱" + `${userName}` + " Frozen");
          /// Lock the thread ///
          await wait(1000); // ** cooldown 10 seconds ** \\
          await threadName.setLocked(true);
          /// Archive the thread ///
          await wait(1500); // ** cooldown 10 seconds ** \\
          await threadName.setArchived(true);
        }
        const applicationStatus = await Application.findOneAndUpdate({
          userId: ap_user.id,
          $set: { status: "Frozen" }, // Change "status" to the field you want to update
          new: true,
        });
        //// Send reply message after rejecting member ///
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.check} The member has been frozen`,
              description: `${emojis.threadMarkmid} You've freeze ${user} from the recruitment system\n${emojis.threadMark}`,
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
        `\x1b[31m Error in Freeze command:`,
        `\x1b[33m ${error.message}`,
      );
      await interaction.editReply({
        embeds: [
          {
            title: `${emojis.warning} Oops!`,
            description: `${emojis.threadMark} An error occurred while freezing ${user}.`,
            color: color.gray,
          },
        ],
        //this is the important part
        ephemeral: true,
      });
    }
  });
};
