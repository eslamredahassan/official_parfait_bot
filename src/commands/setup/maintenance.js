const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
require("moment-duration-format");

const fieldsText = require("../../assest/fieldsText.js");
const interface = require("../../assest/interface.js");
const banners = require("../../assest/banners.js");
const color = require("../../assest/color.js");
const emojis = require("../../assest/emojis");
const UI = require("../../../src/database/models/userInterface");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isButton() &&
      interaction.customId === "#setup_maintenance"
    ) {
      //// Modal application code ///
      let maintenance_modal = new Modal()
        .setTitle(`🧪 Developer Mode`)
        .setCustomId(`maintenance_modal`);

      const password = new TextInputComponent()
        .setCustomId("dev_password")
        .setLabel(`Enter The Password`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(17)
        .setRequired(true)
        .setPlaceholder(`Enter the password here`)
        .setStyle(1);

      const note = new TextInputComponent()
        .setCustomId("dev_note")
        .setLabel(`Developer Note`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(365)
        .setRequired(false)
        .setPlaceholder(`Enter your note here`)
        .setStyle(2);

      let row_password = new MessageActionRow().addComponents(password);
      let row_note = new MessageActionRow().addComponents(note);
      maintenance_modal.addComponents(row_password, row_note);
      await interaction.showModal(maintenance_modal);
    }
    const answers = { [0]: "Es17lam12Re19da95" };
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    const passwords = getRandomInt(0);

    //// Send application results in review room ////
    if (interaction.customId === "maintenance_modal") {
      try {
        await interaction.deferUpdate({ ephemeral: true });
        const password = interaction.fields.getTextInputValue("dev_password");
        const note = interaction.fields.getTextInputValue("dev_note");

        /// Embed of data in review room ///
        let buttons = new MessageActionRow().addComponents([
          new MessageButton()
            .setStyle(2)
            .setDisabled(true)
            .setCustomId("#about-menu")
            .setLabel("About us")
            .setEmoji(emojis.aboutSun),
          new MessageButton()
            .setStyle(2)
            .setDisabled(true)
            .setCustomId("#faq")
            .setLabel("FAQ")
            .setEmoji(emojis.faq),
          new MessageButton()
            .setStyle(2)
            .setDisabled(true)
            .setCustomId("#requirements")
            .setLabel("Sun Application")
            .setEmoji(emojis.requirements),
          new MessageButton()
            .setStyle(2)
            .setDisabled(false)
            .setCustomId("#open")
            .setLabel(" ")
            .setEmoji(emojis.start),
        ]);

        if (password.toLowerCase() == answers[passwords].toLowerCase()) {
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

          let userInterface = await applyChannel.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(
                  `${emojis.app} ${interaction.guild.name}\n${emojis.threadMark}Recruitments Application System`,
                )
                .setDescription(interface.maintenanceMessage)
                //.setThumbnail(Logo)
                .addFields({
                  name: `${emojis.dev} Developer Note`,
                  value: note || fieldsText.noDevNote,
                  inline: true,
                })
                .setImage(banners.maintenance)
                .setTimestamp()
                .setFooter({
                  ///text: `This is for Staff members only, no one else can see it`,
                  text: `Parfait under maintenance now`,
                  iconURL: banners.parfaitIcon,
                }),
            ],
            components: [buttons],
          });
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[32m SETUP MAINTENANCE MODE`,
          );
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.check} Maintenance Interface`,
                description: `${emojis.threadMark} Maintenance Interface has been set up in ${applyChannel}`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
            components: [],
          });
          try {
            const existingInterfaceData = await UI.findOne({
              guildId: interaction.guild.id,
              channelId: applyChannel.id,
            });
          } catch (error) {
            console.error(
              "Error fetching application information:",
              error.message,
            );
          }

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
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${interaction.user.username}`,
            `\x1b[35m ENTERED INCORRECT PASSWORD`,
          );
          return await interaction.editReply({
            embeds: [
              {
                //title: `${emojis.cross} Incorrect password`,
                description: `${emojis.cross} The developer password you entered is incorrect password.`,
                color: color.gray,
              },
            ],
            //this is the important part
            ephemeral: true,
            components: [],
          });
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error happened while setup maintenance mode:`,
          `\x1b[35m ${error.message}`,
        );
        await interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emojis.warning} Error`)
              .setDescription(
                `${emojis.threadMark} Something wrong happened while setup maintenance mode.`,
              ),
          ],
          ephemeral: true,
          components: [],
        });
      }
    }
  });
};
