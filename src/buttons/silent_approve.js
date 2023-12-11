const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

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
    if (interaction.isButton() && interaction.customId === "#silent_approve") {
      try {
        await interaction.deferReply({ ephemeral: true });

        const perms = [`${config.devRole}`, `${config.STAFF}`];
        let staff = guild.members.cache.get(interaction.user.id);
        if (staff.roles.cache.hasAny(...perms)) {
          const ID = interaction.message.embeds[0].footer.text;
          const ap_user = await interaction.guild.members.fetch(ID);

          let promote = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_promote")
              .setLabel(`Promote ${ap_user.user.username}`)
              .setEmoji(emojis.promote),
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_apologize")
              .setLabel(`Apologize`)
              .setEmoji(emojis.apologize),
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_reply")
              .setLabel(` `)
              .setEmoji(emojis.dm),
            new MessageButton()
              .setStyle(4) //-->> Red Color
              .setCustomId("#ap_freeze")
              .setLabel(``)
              .setEmoji(emojis.freeze),
          ]);

          let embed = new MessageEmbed(interaction.message.embeds[0])
            .setTitle(
              `${emojis.alert} Approved by ${interaction.user.username}`,
            )
            .setColor(color.gray)
            .setImage(banners.silentAcceptbanner)
            .setThumbnail(banners.acceptIcon)
            .setTimestamp();

          interaction.message.edit({
            embeds: [embed],
            components: [promote],
          });

          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${ap_user.user.username}`,
            `\x1b[32m Approved by ${interaction.user.username}`,
          );

          //// Send message to log channel after accepting member ///
          const log = interaction.guild.channels.cache.get(config.log);
          await log.send({
            embeds: [
              {
                title: `${emojis.log} Approvement Log`,
                description: `${emojis.check} ${ap_user.user} have been approved silently by ${interaction.user}`,
                color: color.gray,
                timestamp: new Date(),
                footer: {
                  text: "Approved in",
                  icon_url: banners.parfaitIcon,
                },
              },
            ],
            //this is the important part
            ephemeral: false,
          });
          //// Interactions roles ///
          await ap_user.roles.add([config.SunTest, config.SquadSUN]);
          await ap_user.roles.remove(config.waitRole);

          let applyChannel = interaction.guild.channels.cache.get(
            config.applyChannel,
          );
          if (!applyChannel) return;

          const user = ap_user.user;
          const userName = user.username;

          const threadName = applyChannel.threads.cache.find(
            (x) => x.name === `${"🧤︱" + userName + " Tryout"}`,
          );
          /// Rename The Thread ///
          await threadName.setName("🧤︱" + `${userName}` + " Approved");
          /// Lock the thread ///
          await wait(1000); // ** cooldown 10 seconds ** \\
          await threadName.setLocked(true);
          /// Archive the thread ///
          await wait(1500); // ** cooldown 10 seconds ** \\
          await threadName.setArchived(true);

          const applicationStatus = await Application.findOneAndUpdate({
            userId: ap_user.id,
            $set: { status: "Approved Silently" }, // Change "status" to the field you want to update
            new: true,
          });
          //// Send message to accepted member ///
          await interaction
            .editReply({
              embeds: [
                {
                  title: `${emojis.check} Application Approved`,
                  description: `${emojis.threadMarkmid} You have been approved ${user}'s application silently\n${emojis.threadMark} His thread will be automatically archived`,
                  color: color.gray,
                },
              ],
              //this is the important part
              ephemeral: true,
            })
            .catch((error) => console.log(error.message));
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
              //this is the important part
              ephemeral: true,
            })
            .catch((error) => console.log(error.message));
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("lll")}`,
            `\x1b[31m Permission denied`,
          );
        }
      } catch (error) {
        console.error("Error occurred:", error.message);
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Oops!`,
              description: `${emojis.threadMark} Something went wrong while approving this application.`,
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
