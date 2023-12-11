const { MessageActionRow, MessageButton } = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const responses = require("../../assest/responses.js");
const interface = require("../../assest/interface.js");
const fieldsText = require("../../assest/fieldsText.js");
const banners = require("../../assest/banners.js");
const errors = require("../../assest/errors.js");
const color = require("../../assest/color.js");
const emojis = require("../../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "setup") {
      try {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m ${interaction.user.username} USED`,
          `\x1b[35m Setup Command`,
        );
        const cooldownResponse = [
          `${responses.lazy}`,
          `${responses.know}`,
          `${responses.busy}`,
          `${responses.wait}`,
        ];
        const cooldownResponseMessages =
          cooldownResponse[Math.floor(Math.random() * cooldownResponse.length)];

        if (cooldown.has(interaction.user.id)) {
          interaction.reply({
            embeds: [
              {
                title: `${emojis.cooldown} Cooldown`,
                description:
                  `${emojis.whiteDot} Hi  <@${interaction.user.id}>` +
                  ` ${cooldownResponseMessages}`,
                color: `${color.gray}`,
              },
            ],
            //this is the important part
            ephemeral: true,
            components: [],
          });
        } else {
          const btnui = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#setup_open")
              .setLabel("⠀Opened⠀")
              .setEmoji(emojis.unlock),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#setup_close")
              .setLabel("⠀Closed⠀")
              .setEmoji(emojis.lock),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#setup_maintenance")
              .setLabel("⠀Developers Mode⠀")
              .setEmoji(emojis.dev),
          ]);

          const perms = [`${config.devRole}`, `${config.devRoleTest}`];
          let staff = guild.members.cache.get(interaction.user.id);
          if (staff.roles.cache.hasAny(...perms)) {
            await interaction.reply({
              embeds: [
                {
                  title: `${emojis.settings} Setup Options`,
                  description: `### ${emojis.warn} Choose the mode you want to use carefully`,
                  ///thumbnail: { url: "https://i.imgur.com/COzCPdd.png" },
                  image: { url: `${banners.setupBanner}` },
                  color: `${color.gray}`,
                  fields: [
                    {
                      name: `${emojis.unlock} Opened Mode`,
                      value: `${fieldsText.openedMessage}`,
                      inline: false,
                    },
                    {
                      name: `${emojis.lock} Closed Mode`,
                      value: `${fieldsText.closedMessage}`,
                      inline: false,
                    },
                    {
                      name: `${emojis.dev} Developers Mode`,
                      value: `${fieldsText.devMessage}`,
                      inline: false,
                    },
                    {
                      name: `${emojis.info} Notes`,
                      value: `${fieldsText.noteMessage}`,
                      inline: false,
                    },
                  ],
                },
              ],
              //this is the important part
              ephemeral: true,
              components: [btnui],
            });
          } else {
            await interaction.reply({
              embeds: [
                {
                  title: `${emojis.alert} Permission denied`,
                  description: `${errors.permsError}`,
                  color: `${color.gray}`,
                },
              ],
              //this is the important part
              ephemeral: true,
            });
          }
          cooldown.add(interaction.user.id);
          setTimeout(() => {
            // Removes the user from the set after a minute
            cooldown.delete(interaction.user.id);
          }, 60000);
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in setup command:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Error`)
              .setDescription(
                `${emojis.threadMark} Something wrong happened while running setup command.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
