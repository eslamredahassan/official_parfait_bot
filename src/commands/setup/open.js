const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const interface = require("../../assest/interface");
const fieldsText = require("../../assest/fieldsText");
const responses = require("../../assest/responses");
const errors = require("../../assest/errors.js");
const banners = require("../../assest/banners.js");
const color = require("../../assest/color.js");
const emojis = require("../../assest/emojis");
const UI = require("../../../src/database/models/userInterface");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#setup_open") {
      try {
        await interaction.deferUpdate();
        const Messages = [
          `${responses.lazy}`,
          `${responses.know}`,
          `${responses.busy}`,
          `${responses.wait}`,
        ];
        const Response = Messages[Math.floor(Math.random() * Messages.length)];

        if (cooldown.has(interaction.user.id)) {
          interaction.editReply({
            embeds: [
              {
                title: `${emojis.cooldown} Cooldown`,
                description:
                  `${emojis.threadMark} Hi <@${interaction.user.id}>` +
                  ` ${Response}`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
          });
        } else {
          let applyChannel = interaction.guild.channels.cache.get(
            config.applyChannel,
          );

          if (!applyChannel) {
            interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} Error`,
                  description: `<#${applyChannel}> not found or I can't access it.`,
                  color: `${color.gray}`,
                },
              ],
              //this is the important part
              ephemeral: true,
            });
            return;
          }

          // Check if there's an existing interface message in applyChannel
          const existingInterfaceData = await UI.findOne({
            guildId: interaction.guild.id,
            channelId: applyChannel.id,
          });

          if (existingInterfaceData) {
            try {
              // If there's an existing message, fetch it
              const oldInterfaceMessage = await applyChannel.messages.fetch(
                existingInterfaceData.embedId,
                { cache: false }, // Disable caching for this fetch
              );

              // Check if the message exists before trying to delete it
              if (oldInterfaceMessage) {
                await oldInterfaceMessage.delete().catch((error) => {
                  if (error.code === 10008) {
                    console.log(
                      `\x1b[0m`,
                      `\x1b[33m 〢`,
                      `\x1b[33m ${moment(Date.now()).format("LT")}`,
                      `\x1b[31m Old message not found,`,
                      `\x1b[32m it may have been deleted.`,
                    );
                  } else {
                    console.error(
                      `\x1b[0m`,
                      `\x1b[33m 〢`,
                      `\x1b[33m ${moment(Date.now()).format("LT")}`,
                      `\x1b[31m Error deleting old message:`,
                      `\x1b[35m ${error.message}`,
                    );
                  }
                });
              } else {
                console.log(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Old Userinterface not found,`,
                  `\x1b[32m Sent new interface.`,
                );
              }
            } catch (error) {
              if (error.code === 10008) {
                console.log(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Old Userinterface not found,`,
                  `\x1b[32m Sent new interface.`,
                );
              } else {
                console.error(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Error fetching or deleting old message:`,
                  `\x1b[35m ${error.message}`,
                );
              }
            }
          }

          let buttons = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#about-menu")
              .setLabel("About us")
              .setEmoji(emojis.aboutSun),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#faq")
              .setLabel("FAQ")
              .setEmoji(emojis.faq),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#requirements")
              .setLabel("Sun Application")
              .setEmoji(emojis.requirements),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#close")
              .setLabel(" ")
              .setEmoji(emojis.more),
          ]);
          const perms = [`${config.devRole}`, `${config.devRoleTest}`];
          let staff = guild.members.cache.get(interaction.user.id);
          if (staff.roles.cache.hasAny(...perms)) {
            let userInterface = await applyChannel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(
                    `${emojis.app} ${interaction.guild.name}\n${emojis.threadMark}Recruitments Application System`,
                  )
                  .setDescription(interface.MainUImessage)
                  .setThumbnail(Logo)
                  .setImage(banners.openBanner)
                  .addFields([
                    {
                      name: `${emojis.r_rank} Minimum Rank`,
                      value: fieldsText.rank,
                      inline: true,
                    },
                    {
                      name: `${emojis.r_level} Minimum Level`,
                      value: fieldsText.level,
                      inline: true,
                    },
                  ]),
              ],
              components: [buttons],
            });
            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.check} Opened Interface`,
                  description: `${emojis.threadMark} Opened Interface has been set up in ${applyChannel}`,
                  //thumbnail: { url: banners.setupIcon },
                  color: color.gray,
                },
              ],
              //this is the important part
              ephemeral: true,
              components: [],
            });
            const existingInterfaceData = await UI.findOne({
              guildId: interaction.guild.id,
              channelId: applyChannel.id,
            });

            if (existingInterfaceData) {
              // If entry exists, update its properties
              existingInterfaceData.embedId = userInterface.id;

              try {
                // Save the updated entry back to the database
                await existingInterfaceData.save();
              } catch (error) {
                console.error(
                  "Error updating application information:",
                  error.message,
                );
              }
            } else {
              // If entry does not exist, create a new entry
              const interfaceData = new UI({
                guildId: interaction.guild.id,
                channelId: applyChannel.id,
                embedId: userInterface.id,
              });

              try {
                // Save the new entry to the database
                await interfaceData.save();
              } catch (error) {
                console.error(
                  "Error saving application information:",
                  error.message,
                );
              }
            }
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
              .catch(() => console.log("Error Line 831"));
          }
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[35m Setup`,
            `\x1b[32m OPENED MODE`,
          );
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in setup open mode:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Error`)
              .setDescription(
                `${emojis.threadMark} Something wrong happened while setup open mode.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    } else if (interaction.isButton() && interaction.customId === "#open") {
      try {
        const Messages = [
          `${responses.lazy}`,
          `${responses.know}`,
          `${responses.busy}`,
          `${responses.wait}`,
        ];
        const Response = Messages[Math.floor(Math.random() * Messages.length)];

        if (cooldown.has(interaction.user.id)) {
          interaction.reply({
            embeds: [
              {
                title: `${emojis.cooldown} Cooldown`,
                description:
                  `${emojis.whiteDot} Hi  <@${interaction.user.id}>` +
                  ` ${Response}`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
          });
        } else {
          let switchOpen = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#about-menu")
              .setLabel("About us")
              .setEmoji(emojis.aboutSun),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#faq")
              .setLabel("FAQ")
              .setEmoji(emojis.faq),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#requirements")
              .setLabel("Sun Application")
              .setEmoji(emojis.requirements),
            new MessageButton()
              .setStyle(2)
              .setDisabled(false)
              .setCustomId("#close")
              .setLabel(" ")
              .setEmoji(emojis.more),
          ]);

          const perms = [`${config.devRole}`, `${config.devRoleTest}`];
          let staff = guild.members.cache.get(interaction.user.id);
          if (staff.roles.cache.hasAny(...perms)) {
            await interaction.update({
              embeds: [
                new MessageEmbed()
                  .setColor(color.gray)
                  .setTitle(
                    `${emojis.app} ${interaction.guild.name}\n${emojis.threadMark}Recruitments Application System`,
                  )
                  .setDescription(interface.MainUImessage)
                  .setThumbnail(Logo)
                  .setImage(banners.openBanner)
                  .addFields(
                    {
                      name: `${emojis.r_rank} Required Rank`,
                      value: fieldsText.rank,
                      inline: true,
                    },
                    {
                      name: `${emojis.r_level} Required Level`,
                      value: fieldsText.level,
                      inline: true,
                    },
                  ),
              ],
              components: [switchOpen],
            });
            await interaction.followUp({
              embeds: [
                {
                  title: `${emojis.unlock} Recruitment Opened`,
                  description: `At your service ${interaction.user} I'll receive Sun recruitment applications`,
                  color: color.gray,
                },
              ],
              //this is the important part
              ephemeral: true,
            });
          } else {
            await interaction
              .reply({
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
              .catch((e) => {});
          }
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[35m Switched To`,
            `\x1b[32m OPENED MODE`,
          );
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
          `\x1b[31m Error happened while switching to open mode:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Error`)
              .setDescription(
                `${emojis.threadMark} Something wrong happened while switching to open mode.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
