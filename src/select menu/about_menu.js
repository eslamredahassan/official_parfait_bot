const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const fieldsText = require("../assest/fieldsText.js");
const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#about-menu") {
      try {
        await interaction.deferReply({ ephemeral: true });
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${interaction.user.username} USED`,
          `\x1b[35m About Button`,
        );

        const aboutmenu = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("#about-menu")
            .setPlaceholder("Press here to select the category")
            .addOptions([
              {
                label: "About Sun Community",
                value: "#about_sun",
                emoji: emojis.aboutSun,
              },
              {
                label: "Hall of fame for tourney wins",
                value: "#hall_of_fame",
                emoji: emojis.otherAchv,
              },
              {
                label: "Sun Leaders",
                value: "#sun_leaders",
                emoji: emojis.leader,
              },
              {
                label: "Staff Members",
                value: "#sun_staff_members",
                emoji: emojis.staff,
              },
              {
                label: "Our Partners",
                value: "#our_partners",
                emoji: emojis.partner,
              },
            ]),
        );

        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.aboutSun} About ${interaction.guild.name}`,
              description: `**We're glad that you are interested in knowing more about us**`,
              image: { url: banners.aboutSunBanner },
              color: color.gray,
              fields: [
                {
                  name: `${emojis.warning} Notice`,
                  value: `${emojis.threadMark} The this menu will be updated from time to time`,
                  inline: false,
                },
                {
                  name: `${emojis.lastUpdate} Last update`,
                  value: `${emojis.threadMark} <t:1693612080:D>`,
                  inline: true,
                },
              ],
            },
          ],
          ephemeral: true,
          components: [aboutmenu],
        });
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error happened while using About menu:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Oops!`,
              description: `Something went wrong while trying to execute this option.`,
              color: color.gray,
            },
          ],
        });
      }
    } else if (
      interaction.isSelectMenu() &&
      interaction.customId === "#about-menu"
    ) {
      try {
        await interaction.deferUpdate({ ephemeral: true });
        let choices = interaction.values;

        if (choices && choices.length > 0) {
          for (let choice of choices) {
            if (choice === "#about_sun") {
              const controll = new MessageActionRow().addComponents([
                new MessageButton()
                  .setStyle(5)
                  .setLabel(`Youtube`)
                  .setURL(
                    `https://www.youtube.com/channel/UCxtjE4pbP7O3RwKm5yyhltg`,
                  )
                  .setEmoji(emojis.youtube),
                new MessageButton()
                  .setStyle(5)
                  .setLabel(`Twitch`)
                  .setURL(`https://www.twitch.tv/sunco#sun_staff_membersash`)
                  .setEmoji(emojis.twitch),
                new MessageButton()
                  .setStyle(5)
                  .setLabel(`Battlefy`)
                  .setURL(
                    `https://battlefy.com/sunco-#sun_staff_membersash-legends`,
                  )
                  .setEmoji(emojis.battlefy),
              ]);

              const aboutmenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("#about-menu")
                  .setPlaceholder("Select From Here")
                  .addOptions([
                    {
                      label: "About Sun Community",
                      value: "#about_sun",
                      default: true,
                      emoji: emojis.aboutSun,
                    },
                    {
                      label: "Hall of fame for tourney wins",
                      value: "#hall_of_fame",
                      emoji: emojis.otherAchv,
                    },
                    {
                      label: "Sun Leaders",
                      value: "#sun_leaders",
                      emoji: emojis.leader,
                    },
                    {
                      label: "Staff Members",
                      value: "#sun_staff_members",
                      emoji: emojis.staff,
                    },
                    {
                      label: "Our Partners",
                      value: "#our_partners",
                      emoji: emojis.partner,
                    },
                  ]),
              );

              console.log(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${interaction.user.username}`,
                `\x1b[35m Watching About Sun&CO Category`,
              );

              await interaction.editReply({
                embeds: [
                  {
                    title: `${emojis.aboutSun} About ${interaction.guild.name}`,
                    description: fieldsText.aboutSun,
                    image: { url: banners.sunBanner },
                    color: color.gray,
                  },
                ],
                ephemeral: true,
                components: [controll, aboutmenu],
              });
            } else if (choice === "#hall_of_fame") {
              const aboutmenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("#about-menu")
                  .setPlaceholder("Select From Here")
                  .addOptions([
                    {
                      label: "About Sun Community",
                      value: "#about_sun",
                      emoji: emojis.aboutSun,
                    },
                    {
                      label: "Hall of fame for tourney wins",
                      value: "#hall_of_fame",
                      default: true,
                      emoji: emojis.otherAchv,
                    },
                    {
                      label: "Sun Leaders",
                      value: "#sun_leaders",
                      emoji: emojis.leader,
                    },
                    {
                      label: "Staff Members",
                      value: "#sun_staff_members",
                      emoji: emojis.staff,
                    },
                    {
                      label: "Our Partners",
                      value: "#our_partners",
                      emoji: emojis.partner,
                    },
                  ]),
              );

              console.log(
                `\xb1[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${interaction.user.username}`,
                `\x1b[35m Watching Hall of fame Category`,
              );

              await interaction.editReply({
                embeds: [
                  {
                    title: `${emojis.achv} Hall of fame for tourney wins`,
                    description: fieldsText.hallOfFame,
                    image: { url: banners.hofBanner },
                    color: color.gray,
                  },
                ],
                ephemeral: true,
                components: [aboutmenu],
              });
            } else if (choice === "#sun_staff_members") {
              const aboutmenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("#about-menu")
                  .setPlaceholder("Select From Here")
                  .addOptions([
                    {
                      label: "About Sun Community",
                      value: "#about_sun",
                      emoji: emojis.aboutSun,
                    },
                    {
                      label: "Hall of fame for tourney wins",
                      value: "#hall_of_fame",
                      emoji: emojis.otherAchv,
                    },
                    {
                      label: "Sun Leaders",
                      value: "#sun_leaders",
                      emoji: emojis.leader,
                    },
                    {
                      label: "Staff Members",
                      value: "#sun_staff_members",
                      default: true,
                      emoji: emojis.staff,
                    },
                    {
                      label: "Our Partners",
                      value: "#our_partners",
                      emoji: emojis.partner,
                    },
                  ]),
              );

              console.log(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${interaction.user.username}`,
                `\x1b[35m Watching Staff Members Category`,
              );
              await interaction.editReply({
                embeds: [
                  {
                    title: `Staff Members`,
                    description: fieldsText.staffMembers,
                    image: { url: banners.staffBanner },
                    color: color.gray,
                  },
                ],
                ephemeral: true,
                components: [aboutmenu],
              });
            } else if (choice === "#sun_leaders") {
              const aboutmenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("#about-menu")
                  .setPlaceholder("Select From Here")
                  .addOptions([
                    {
                      label: "About Sun Community",
                      value: "#about_sun",
                      emoji: emojis.aboutSun,
                    },
                    {
                      label: "Hall of fame for tourney wins",
                      value: "#hall_of_fame",
                      emoji: emojis.otherAchv,
                    },
                    {
                      label: "Sun Leaders",
                      value: "#sun_leaders",
                      default: true,
                      emoji: emojis.leader,
                    },
                    {
                      label: "Staff Members",
                      value: "#sun_staff_members",
                      emoji: emojis.staff,
                    },
                    {
                      label: "Our Partners",
                      value: "#our_partners",
                      emoji: emojis.partner,
                    },
                  ]),
              );

              console.log(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${interaction.user.username}`,
                `\x1b[35m Watching Leaders Category`,
              );

              await interaction.editReply({
                embeds: [
                  {
                    title: `Sun Community Leaders`,
                    description: fieldsText.leaders,
                    image: { url: banners.leadersBanner },
                    color: color.gray,
                  },
                ],
                ephemeral: true,
                components: [aboutmenu],
              });
            } else if (choice === "#our_partners") {
              const aboutmenu = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setCustomId("#about-menu")
                  .setPlaceholder("Select From Here")
                  .addOptions([
                    {
                      label: "About Sun Community",
                      value: "#about_sun",
                      emoji: emojis.aboutSun,
                    },
                    {
                      label: "Hall of fame for tourney wins",
                      value: "#hall_of_fame",
                      emoji: emojis.otherAchv,
                    },
                    {
                      label: "Sun Leaders",
                      value: "#sun_leaders",
                      emoji: emojis.leader,
                    },
                    {
                      label: "Staff Members",
                      value: "#sun_staff_members",
                      emoji: emojis.staff,
                    },
                    {
                      label: "Our Partners",
                      value: "#our_partners",
                      default: true,
                      emoji: emojis.partner,
                    },
                  ]),
              );

              console.log(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${interaction.user.username}`,
                `\x1b[35m Watching Our Partners Category`,
              );

              await interaction.editReply({
                embeds: [
                  {
                    title: `Our Partners`,
                    description: fieldsText.partners,
                    image: { url: banners.partnerBanner },
                    color: color.gray,
                  },
                ],
                ephemeral: true,
                components: [aboutmenu],
              });
            }
          }
        }
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in about menu choices:`,
          `\x1b[34m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Error`,
              description: `Something went wrong while trying to execute this option.`,
              color: color.gray,
            },
          ],
        });
      }
    }
  });
};
