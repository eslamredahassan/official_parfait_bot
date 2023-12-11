const { MessageEmbed } = require("discord.js");

const moment = require("moment");

const messages = require("../assest/messages.js");
const banners = require("../assest/banners.js");
const errors = require("../assest/errors.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

// Database Schemas
const Application = require("../../src/database/models/application");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#ap_promote") {
      try {
        await interaction.deferReply({ ephemeral: true });

        const perms = [`${config.devRole}`, `${config.STAFF}`];
        let staff = guild.members.cache.get(interaction.user.id);
        if (staff.roles.cache.hasAny(...perms)) {
          const ID = interaction.message.embeds[0].footer.text;
          const ap_user = await interaction.guild.members.fetch(ID);
          const announces = interaction.guild.channels.cache.get(
            config.announcesChannel,
          );

          await announces.send(
            `Say Congratulations to ${ap_user} he is now officially in <@&${config.TeamSun}> :partying_face:`,
          );

          let embed = new MessageEmbed(interaction.message.embeds[0])
            .setTitle(
              `${emojis.alert} Promoted by ${interaction.user.username}`,
            )
            .setColor(color.gray)
            .setImage(banners.FinishpromoteBanner)
            .setThumbnail(banners.FinishpromoteIcon)
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
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${ap_user.user.username}`,
            `\x1b[32m PROMOTED BY ${interaction.user.username}`,
          );
          //// Send message to accepted member ///
          await ap_user.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.s_parfait} Congratulations`)
                .setImage(banners.promoteBanner)
                .setDescription(messages.promoteMessage),
            ],
          });
          //// Send message to log channel after promoting member ///
          const log = interaction.guild.channels.cache.get(config.log);
          await log.send({
            embeds: [
              {
                title: `${emojis.log} Promote Log`,
                description: `${emojis.promoted} ${ap_user.user} have been promoted by ${interaction.user}`,
                color: color.gray,
                timestamp: new Date(),
                footer: {
                  text: "Promoted in",
                  icon_url: banners.parfaitIcon,
                },
              },
            ],
            //this is the important part
            ephemeral: false,
          });
          //// Interactions roles ///
          await ap_user.roles.remove(config.SunTest);
          await ap_user.roles.add(config.TeamSun);

          const applicationStatus = await Application.findOneAndUpdate({
            userId: ap_user.id,
            $set: { status: "Promoted" }, // Change "status" to the field you want to update
            new: true,
          });
          //// Send message after accepting member ///
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.check} Promotion Alert`,
                description: `${emojis.threadMarkmid} You promoted ${ap_user} to <@&${config.TeamSun}> member\n${emojis.threadMark} Removed his application from pin list`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
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
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in promote command:`,
          `\x1b[31m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Oops!`,
              description: `${emojis.threadMark} Something went wrong wrong while promoting ${ap_user}.`,
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
