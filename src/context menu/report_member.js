const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const fs = require("fs");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isContextMenu() && interaction.commandName === "Report") {
      try {
        let targetUser;
        if (interaction.targetType === "USER") {
          // If the interaction target is a user, not a member
          targetUser = await interaction.guild.members.fetch(
            interaction.targetId,
          );
        } else {
          // If the interaction target is already a member
          targetUser = interaction.member;
        }

        if (!targetUser) {
          throw new Error("Unknown User");
        }
        // Check if the targetUser is a bot
        if (targetUser.user.bot) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.warning} Huh?!`)
                .setDescription(
                  `${emojis.threadMark} You can't report ${targetUser.user} because he's a bot, Don't tell anyone 🤫`,
                ),
            ],
            ephemeral: true,
            components: [],
          });
        }

        const roles = [config.SunTest, config.SquadSUN, config.TeamSun];
        if (!targetUser.roles.cache.hasAny(...roles)) {
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.warning} Oops!`)
                .setDescription(
                  `${emojis.threadMarkmid} ${targetUser.user} Isn't a Squad Member,\n${emojis.threadMark} You can use this command only to report Sun Members.`,
                ),
            ],
            ephemeral: true,
            components: [],
          });
        } else {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username} USED`,
            `\x1b[35m Report ${targetUser.user.username}`,
          );

          //// Modal application code ///
          let reportMember_modal = new Modal()
            .setTitle(`🚷 Report ${targetUser.user.username}`)
            .setCustomId(`reportMember_modal`);

          const details = new TextInputComponent()
            .setCustomId("report_details")
            .setLabel(
              `Why do you want to report ${targetUser.user.username}?`.substring(
                0,
                45,
              ),
            )
            .setMinLength(4)
            .setMaxLength(365)
            .setRequired(true)
            .setPlaceholder(`Type your report details here`)
            .setStyle(2);

          let row_details = new MessageActionRow().addComponents(details);
          reportMember_modal.addComponents(row_details);
          await interaction.showModal(reportMember_modal);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        return interaction.reply({
          content: `Error fetching user: ${error.message}`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId === "reportMember_modal") {
      await interaction.deferReply({ ephemeral: true });
      try {
        let targetUser;
        if (interaction.targetType === "USER") {
          targetUser = await interaction.guild.members.fetch(
            interaction.targetId,
          );
        } else {
          targetUser = interaction.member;
        }

        if (!targetUser || !targetUser.user) {
          throw new Error("Unknown User");
        }

        let details = interaction.fields.getTextInputValue("report_details");

        let reportMemberChannel = client.channels.cache.get(config.log);
        if (!reportMemberChannel) return;

        const reply = new MessageActionRow().addComponents([
          new MessageButton()
            .setStyle(2)
            .setCustomId("#warn")
            .setLabel(`Warn ${interaction.user.username}`)
            .setDisabled(true)
            .setEmoji(emojis.warn),
          new MessageButton()
            .setStyle(2)
            .setCustomId("#freeze")
            .setDisabled(true)
            .setLabel(`Freeze`)
            .setEmoji(emojis.freeze),
          new MessageButton()
            .setStyle(2)
            .setCustomId("#kick")
            .setDisabled(true)
            .setLabel(`Kick`)
            .setEmoji(emojis.warning),
          new MessageButton()
            .setStyle(2)
            .setCustomId("#ban")
            .setDisabled(true)
            .setLabel(`Ban`)
            .setEmoji(emojis.warning),
        ]);

        /// Embed of data in review room ///
        await reportMemberChannel.send({
          embeds: [
            new MessageEmbed()
              //.setTitle(`${emojis.warning} Report`)
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(color.gray)
              .setDescription(
                `**${emojis.threadMark} Reported ${targetUser.user}**`,
              )
              .setImage(banners.channelBugBanner)
              .addFields([
                {
                  name: `${emojis.log} Report Details`,
                  value: details,
                  inline: false,
                },
                {
                  name: `${emojis.id} Reported Channel`,
                  value: `${emojis.threadMark} <#${interaction.channel.id}>`,
                  inline: false,
                },
                {
                  name: `${emojis.time} Reported On`,
                  value: `${emojis.threadMark} <t:${Math.floor(
                    Date.now() / 1000,
                  )}:R> ${emojis.pinkDot} <t:${Math.floor(
                    Date.now() / 1000,
                  )}:F>`,
                  inline: false,
                },
              ])
              .setTimestamp()
              .setFooter({
                text: targetUser.user.id,
                iconURL: targetUser.user.displayAvatarURL(),
              }),
          ],
          components: [reply],
        });
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.check} Your report has been sent to the developer`,
              description: `- Thank you ${interaction.user} for reporting this bug\n- We are also sorry to make you encounter this bug and we will work to fix it as soon as possible`,
              color: color.gray,
              image: { url: banners.reportBugBanner },
            },
          ],
          // this is the important part
          ephemeral: true,
          components: [],
        });
      } catch (error) {
        console.error("Error fetching user:", error.message);
        return interaction.editReply({
          content: `Error fetching user: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  });
};
