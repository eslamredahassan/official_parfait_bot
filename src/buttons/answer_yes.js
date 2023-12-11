const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#answer_yes") {
      try {
        await interaction.deferUpdate({ ephemeral: true });

        const applyButton = new MessageActionRow().addComponents([
          new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled(false)
            .setCustomId("#ap_apply")
            .setLabel("Become a Sun Legend")
            .setEmoji(emojis.apply),
        ]);

        const allowedtoApply = [config.en_eu, config.fr];
        if (interaction.member.roles.cache.hasAny(...allowedtoApply)) {
          await interaction.editReply({
            embeds: [
              {
                title: "You're now ready to apply",
                description:
                  "Press **Become a Sun Legend** and then fill out your application",
                image: { url: banners.readyBanner },
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [applyButton],
          });
        } else if (interaction.member.roles.cache.has(config.en_na)) {
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.warning} Unfortunately`,
                description: `${emojis.threadMarkmid} Unfortunately, only European players are allowed to apply\n${emojis.threadMarkmid} Anyway, you've got <@&${config.en_na}> role\n${emojis.threadMark} You'll know when we open the recruitment for NA players`,
                image: { url: banners.sorryBanner },
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [],
          });
        } else {
          console.log(
            `\x1b[33m  〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username} ANSWERED`,
            `\x1b[35m Yes`,
          );

          const languges = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId("#answer_yes_menu")
              .setPlaceholder("Choose your language and your region from here")
              .addOptions([
                {
                  label: "[EU] English",
                  value: "#en_eu",
                  description: "Choose this if you're European player",
                  emoji: emojis.eu,
                },
                {
                  label: "[NA] English",
                  value: "#en_na",
                  description: "Choose this if you're North American player",
                  emoji: emojis.na,
                },
                {
                  label: "French",
                  value: "#french",
                  description: "French people are European by default 👽",
                  emoji: emojis.fr,
                },
              ]),
          );

          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.lang} Choose your Languages and your regions`,
                description: `${emojis.threadMark} This will give you access to specific rooms based on your region`,
                image: { url: banners.langBanner },
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [languges],
          });
        }
      } catch (error) {
        console.error("Error:", error.message);
        await interaction.reply({
          content: "Oops! There was an error processing your request.",
          ephemeral: true,
        });
      }
    } else if (
      interaction.isSelectMenu() &&
      interaction.customId === "#answer_yes_menu"
    ) {
      await interaction.deferUpdate({ ephemeral: true });
      let choices = interaction.values;
      if (choices && choices.length > 0) {
        for (let choice of choices) {
          if (choice === "#en_eu") {
            let applyButtonEU = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#ap_apply")
                .setLabel("Become a Sun Legend")
                .setEmoji(emojis.apply),
            ]);

            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m ${interaction.user.username} CHOOSED`,
              `\x1b[35m English Europ`,
            );

            try {
              if (!interaction.member.roles.cache.has(config.en_eu)) {
                await interaction.member.roles.add(config.en_eu);
              }
            } catch (error) {
              console.error(`Error adding role: ${error.message}`);
            }

            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.check} You're now ready to apply`,
                  description: `${emojis.threadMark} Press **Become a Sun Legend** and then fill out your application`,
                  image: { url: banners.readyBanner },
                  color: color.gray,
                },
              ],
              ephemeral: true,
              components: [applyButtonEU],
            });
          } else if (choice === "#en_na") {
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m ${interaction.user.username} CHOOSED`,
              `\x1b[35m English NA`,
            );

            const applyButton = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(true)
                .setCustomId("#ap_apply")
                .setLabel("Become a Sun Legend")
                .setEmoji(emojis.apply),
            ]);

            try {
              if (!interaction.member.roles.cache.has(config.en_na)) {
                await interaction.member.roles.add(config.en_na);
              }
            } catch (error) {
              console.error(`Error adding role: ${error.message}`);
            }

            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} Unfortunately`,
                  description: `${emojis.threadMarkmid} Unfortunately, only European players are allowed to apply\n${emojis.threadMarkmid} Anyway, you've got <@&${config.en_na}> role\n${emojis.threadMark} You'll know when we open the recruitment for NA players`,
                  image: { url: banners.sorryBanner },
                  color: color.gray,
                },
              ],
              ephemeral: true,
              components: [],
            });
          } else if (choice === "#french") {
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m ${interaction.user.username} CHOOSED`,
              `\x1b[35m French`,
            );

            const applyButtonFR = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#ap_apply")
                .setLabel("Become a Sun Legend")
                .setEmoji(emojis.apply),
            ]);
            try {
              if (!interaction.member.roles.cache.has(config.fr)) {
                await interaction.member.roles.add(config.fr);
              }
            } catch (error) {
              console.error(`Error adding role: ${error.message}`);
            }
            await interaction.editReply({
              embeds: [
                {
                  title: "You're now ready to apply",
                  description:
                    "Press **Become a Sun Legend** and then fill out your application",
                  image: { url: banners.readyBanner },
                  color: color.gray,
                },
              ],
              ephemeral: true,
              components: [applyButtonFR],
            });
          }
        }
      }
    }
  });
};
