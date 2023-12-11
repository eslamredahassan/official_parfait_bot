const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const moment = require("moment");
const fs = require("fs");

const Application = require("../../src/database/models/application");
const errors = require("../../src/assest/errors.js");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isContextMenu() &&
      interaction.commandName === "Application"
    ) {
      await interaction.deferReply({ ephemeral: true });

      let guild = client.guilds.cache.get(config.guildID);
      const perms = [
        `${config.devRole}`,
        `${config.STAFF}`,
        `${config.staffSun}`,
      ];
      let staff = guild.members.cache.get(interaction.user.id);

      if (staff.roles.cache.hasAny(...perms)) {
        const userId = interaction.targetId;

        try {
          // Check if the user is a bot
          const isBot = client.users.cache.get(userId)?.bot;

          if (isBot) {
            interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} Huh?!`,
                  description: `${emojis.threadMark} You can't view the application of a bot.`,
                  color: color.gray,
                },
              ],
              ephemeral: true,
            });
            return;
          }
          // Check if the command was triggered by the bot itself
          const isTargetingBot = userId === client.user.id;

          if (isTargetingBot) {
            // Respond differently when the bot triggered the command
            interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} Nah Nah Nah!!`,
                  description: `${emojis.threadMark} No one can see my application.`,
                  color: color.gray,
                },
              ],
              ephemeral: true,
            });
            return;
          }

          const app_user = await client.users.fetch(userId); // Fetch user data by userId

          let filter;

          // Check if the userId is a valid ObjectId
          if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            filter = { userId: userId };
          } else {
            // If not an ObjectId, perform a case-insensitive search on other fields
            filter = {
              $or: [
                { username: app_user.username }, // Use username instead of searchOption
                { user_code: userId },
                { application: userId },
              ],
            };
          }

          const application = await Application.findOne(filter);

          if (!application) {
            interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} No application found`,
                  description: `${emojis.threadMark} ${app_user} has no application in my database or his application is missing.`,
                  color: color.gray,
                },
              ],
              ephemeral: true,
            });
            return;
          }

          const embed = {
            title: `${emojis.app} Status\n${emojis.threadMark} ${application.status}`,
            author: {
              name: `${application.username}'s application`,
              icon_url: app_user.displayAvatarURL(),
            },
            color: color.gray,
            //description: ` `,
            image: { url: banners.appResultBanner },
            thumbnail: { url: banners.appResultIcon },
            fields: [
              {
                name: `${emojis.discord} Discord Profile`,
                value: `${emojis.threadMark} ${
                  app_user ? app_user.toString() : "N/A"
                }`,
                inline: true,
              },
              {
                name: `${emojis.id} Smash Code`,
                value:
                  `${emojis.threadMark} ||${application.user_code}||` || "N/A",
                inline: true,
              },
              {
                name: `${emojis.competition} Competitions/Trainings`,
                value:
                  `${emojis.threadMark} \`\`${application.user_ct}\`\`` ||
                  "N/A",
                inline: false,
              },
              {
                name: `${emojis.age} Age`,
                value: `${emojis.threadMark} \`\`${
                  application.user_age ? application.user_age.toString() : "N/A"
                }\`\` years old`,
                inline: false,
              },
              {
                name: `${emojis.favorites} Favorite Legends`,
                value:
                  `${emojis.threadMark} \`\`${application.user_legends}\`\`` ||
                  "N/A",
                inline: false,
              },
              {
                name: `${emojis.question} What can you bring to SUN ?`,
                value:
                  `${emojis.threadMark} \`\`${application.user_why}\`\`` ||
                  "N/A",

                inline: false,
              },
              {
                name: `${emojis.thread} Tryout thread`,
                value: `${emojis.threadMark} <#${application.thread}>` || "N/A",
                inline: false,
              },
              {
                name: `${emojis.time} Applied in`,
                value:
                  `${emojis.threadMark} <t:${Math.floor(
                    application.createdIn / 1000,
                  )}:D> - <t:${Math.floor(application.createdIn / 1000)}:R>` ||
                  "N/A",
                inline: false,
              },
            ],
            footer: {
              text: application.userId,
              icon_url: banners.parfaitIcon,
            },
          };

          interaction.editReply({
            embeds: [embed],
            components: [],
            ephemeral: true,
          });
        } catch (error) {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error fetching data:`,
            `\x1b[34m ${error.message}`,
          );
          interaction.editReply({
            embeds: [
              {
                title: `${emojis.warning} Oops!`,
                description: `${emojis.threadMark} Something went wrong while fetching ${app_user}'s application.`,
                color: color.gray,
              },
            ],
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.alert} Permission denied`,
              description: errors.permsError,
              color: color.gray,
            },
          ],
          ephemeral: true,
        });
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("lll")}`,
          `\x1b[31m Permission denied`,
        );
      }
    }
  });
};
