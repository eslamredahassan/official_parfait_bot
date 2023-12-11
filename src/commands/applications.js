const Application = require("../../src/database/models/application");
const errors = require("../../src/assest/errors.js");
const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "applications") {
      await interaction.deferReply({ ephemeral: true });

      let guild = client.guilds.cache.get(config.guildID);
      const perms = [
        `${config.devRole}`,
        `${config.STAFF}`,
        `${config.staffSun}`,
      ];
      let staff = guild.members.cache.get(interaction.user.id);
      if (staff.roles.cache.hasAny(...perms)) {
        const searchOption = interaction.options.getString("search");
        try {
          let filter;

          // Check if the searchOption is a valid ObjectId
          if (/^[0-9a-fA-F]{24}$/.test(searchOption)) {
            filter = { _id: searchOption };
          } else {
            // If not an ObjectId, perform a case-insensitive search on other fields
            filter = {
              $or: [
                { username: searchOption },
                { userId: searchOption },
                { user_code: searchOption },
                { application: searchOption },
              ],
            };
          }

          const application = await Application.findOne(filter);

          if (!application) {
            interaction.editReply(
              `I didn't find any application for \`\`${searchOption}\`\` in my database.`,
            );
            return;
          }

          const app_user = interaction.guild.members.cache.get(
            application.userId,
          );
          const embed = {
            title: `${emojis.app} Status\n${emojis.threadMark} ${application.status}`,
            author: {
              name: `${application.username}'s application`,
              icon_url: app_user.user.displayAvatarURL(),
            },
            color: color.gray,
            description: ` `,
            image: { url: banners.appResultBanner },
            thumbnail: { url: banners.appResultIcon },
            fields: [
              {
                name: `${emojis.discord} Discord Profile`,
                value: `${emojis.threadMark} ${app_user.user}` || "N/A",
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
          console.error("Error fetching data:", error.message);
          interaction.editReply({
            content: "Error fetching data. Please try again later.",
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
          //this is the important part
          ephemeral: true,
        });
        console.log(
          `\x1b[0m`,
          `\x1b[31m 🛠`,
          `\x1b[33m ${moment(Date.now()).format("lll")}`,
          `\x1b[31m Permission denied`,
        );
      }
    }
  });
};
