const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const moment = require("moment");

const messages = require("../assest/messages.js");
const interface = require("../assest/interface.js");
const fieldsText = require("../assest/fieldsText.js");
const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");
const Cooldown = require("../../src/database/models/CooldownModel");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#requirements") {
      try {
        await interaction.deferReply({ ephemeral: true });

        const answerButtons = new MessageActionRow().addComponents([
          new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled(false)
            .setCustomId("#answer_yes")
            .setLabel("⠀I've read the requirements⠀")
            .setEmoji(emojis.check),
          new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled(false)
            .setCustomId("#answer_no")
            .setLabel("⠀I havent read it yet⠀")
            .setEmoji(emojis.cross),
        ]);
        let member = guild.members.cache.get(interaction.user.id);
        if (member.roles.cache.has(config.coolDown)) {
          const cooldown = await Cooldown.findOne({
            userId: member.id,
            roleId: config.coolDown,
          });
          if (cooldown) {
            const roleExpiry = cooldown.expiry.getTime();
            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.cooldown} Cooldown Member Detected`,
                  description: `${
                    emojis.threadMark
                  } You're still in the cooldown period and it will end <t:${Math.floor(
                    roleExpiry / 1000,
                  )}:R>.`,
                  //image: { url: banners.langBanner },
                  color: color.gray,
                },
              ],
              //this is the important part
              ephemeral: true,
              components: [],
            });
          }
        } else if (member.roles.cache.has(config.SquadSUN)) {
          return interaction.editReply({
            embeds: [
              {
                title: `${emojis.id} Sun Member Detected`,
                description: `Hi ${interaction.user} you already in <@&${config.SquadSUN}>`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
          });
        } else if (member.roles.cache.has(config.waitRole)) {
          const applyChannel = interaction.guild.channels.cache.get(
            config.applyChannel,
          );

          const user = interaction.user;
          const userName = user.username;

          const threadName = applyChannel.threads.cache.find(
            (x) => x.name === `${"🧤︱" + userName + " Tryout"}`,
          );

          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.alert} Alert`,
                description: `Hi ${interaction.user} We've already received your application`,
                color: `${color.gray}`,
                fields: [
                  {
                    name: `${emojis.tryOut} You're now in try out process`,
                    value: `${emojis.whiteDot} Check your try out post in ${threadName} thread`,
                    inline: true,
                  },
                ],
              },
            ],
            //this is the important part
            ephemeral: true,
            components: [],
          });
        } else if (member.roles.cache.has(config.banRole)) {
          return interaction.editReply({
            embeds: [
              {
                title: `${emojis.banApp} Freezed`,
                description: `${emojis.cross} ${messages.Banned}`,
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [],
          });
        } else {
          const rules = new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.rules} Rules and terms`)
            .setDescription(interface.RequirementsMessage);
          //.setThumbnail(Logo)
          //.setImage(banners.requirementsBanner)

          const requirements = new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.app} In-game Requirements`)
            .setDescription("")
            //.setThumbnail(Logo)
            //.setImage(banners.requirementsBanner)
            .addFields([
              {
                name: `${emojis.r_rank} **Required Rank**`,
                value: fieldsText.rank,
                inline: true,
              },
              {
                name: `${emojis.r_level} **Required Level**`,
                value: fieldsText.level,
                inline: true,
              },
              {
                name: `${emojis.alert} **Importat Note**`,
                value: fieldsText.importantNote,
                inline: false,
              },
            ]);

          const notes = new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.cooldown} **Cooldown**`)
            .setDescription(fieldsText.cooldownNote);
          //.setThumbnail(Logo)
          //.setImage(banners.requirementsBanner)

          const Guide = new MessageEmbed()
            .setColor(color.gray)
            .setTitle(`${emojis.guide} **User Guide**`)
            .setDescription(fieldsText.warning)
            //.setThumbnail(Logo)
            .setImage(banners.requirementsBanner)
            .setFooter({
              text: interaction.guild.name,
              iconURL: banners.parfaitIcon,
            });

          await interaction.editReply({
            embeds: [rules, requirements, notes, Guide],
            ephemeral: true,
            components: [answerButtons],
          });
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username} READ`,
            `\x1b[35m the requirements`,
          );
        }
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in requirements command:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Oops!`,
              description: `${emojis.threadMark} Something went wrong while loading some data.`,
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
