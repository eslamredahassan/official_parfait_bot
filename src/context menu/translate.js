const { MessageEmbed } = require("discord.js");
const { detect } = require("langdetect");

const translate = require("translate-google");
const moment = require("moment");
const fs = require("fs");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// List of supported languages
const supportedLanguages = [
  { code: "ar", name: `العربية ${emojis.eg}` },
  { code: "en", name: `${emojis.na} English` },
  { code: "fr", name: `${emojis.fr} Français` },
  { code: "de", name: `${emojis.gr} Deutsch` },
  { code: "it", name: `${emojis.it} Italiano` },
  { code: "ru", name: `${emojis.ru} Русский` },
  // Add more languages as needed
];

// Function to get the full language name from the code
const getLanguageName = (code) => {
  const language = supportedLanguages.find((lang) => lang.code === code);
  return language ? language.name : code;
};

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    let guild = client.guilds.cache.get(config.guildID);
    if (
      interaction.isContextMenu() &&
      interaction.commandName === "Translate"
    ) {
      try {
        await interaction.deferReply({ ephemeral: true });
        const message = await interaction.channel.messages.fetch(
          interaction.targetId,
        );
        const roles = [
          config.SunTest,
          config.SquadSUN,
          config.TeamSun,
          config.devRole,
          config.STAFF,
        ];
        let user = guild.members.cache.get(interaction.user.id);
        if (!user.roles.cache.hasAny(...roles)) {
          interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.warning} Oops!`)
                .setDescription(
                  `${emojis.threadMark} This feature is only exclusive to Sun Members.`,
                ),
            ],
            ephemeral: true,
            components: [],
          });
        } else {
          const textToTranslate = message.content;

          // Detect the original language
          const detectedResult = detect(textToTranslate);
          const originalLanguage = detectedResult[0].lang;

          console.info(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[32m Translated: ${textToTranslate}`,
          );

          // Filter out the original language from supported languages
          const languages = supportedLanguages
            .filter((lang) => lang.code !== originalLanguage.toLowerCase())
            .map((lang) => lang.code);

          const translations = [];

          for (const lang of languages) {
            if (translations.length !== 0) {
              await delay(1000);
            }

            try {
              const text = await translate(textToTranslate, {
                to: lang,
                from: originalLanguage.toLowerCase(),
              });

              // Check if the translation result is a string
              if (typeof text === "string") {
                translations.push({ lang, translation: text });
              } else {
                console.error(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Unexpected translation result:`,
                  `\x1b[32m ${text}`,
                );
                // You can choose to handle the unexpected result differently
                // For now, we continue with the next translation
                continue;
              }
            } catch (translationError) {
              console.error(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m Translation Error for ${lang}`,
                `\x1b[32m ${translationError.message}`,
              );
              // Handle translation error as needed
            }
          }

          if (translations.length === 0) {
            // If there are no translations, reply with an error message
            await interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setTitle(`${emojis.warning} Oops!`)
                  .setDescription(
                    `${emojis.threadMark} Failed to translate. Please provide valid text."`,
                  )
                  .setColor(color.gray),
              ],
              ephemeral: true,
            });
          } else {
            const embeds = translations.map((translation) => {
              const embed = new MessageEmbed()
                .setTitle(`${getLanguageName(translation.lang)}`)
                .setDescription(translation.translation)
                .setColor(color.gray);
              return embed;
            });

            await interaction.editReply({ embeds: embeds, ephemeral: true });
          }
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Translation Error`,
          `\x1b[32m ${error.message}`,
        );

        if (error.code === "BAD_REQUEST") {
          console.error("Request details:", error.request);
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle(`${emojis.warning} Oops!`)
                .setDescription(
                  `${emojis.threadMark} Failed to translate. Please provide valid text."`,
                )
                .setColor(color.gray),
            ],
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle(`${emojis.warning} Oops!`)
                .setDescription(
                  `${emojis.threadMark} Something went wrong while translating. Please try again later.`,
                )
                .setColor(color.gray),
            ],
            ephemeral: true,
          });
        }
      }
    }
  });
};
