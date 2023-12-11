const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const Cooldown = require("../../../src/database/models/CooldownModel");

const errors = require("../../../src/assest/errors.js");
const color = require("../../../src/assest/color.js");
const banners = require("../../../src/assest/banners.js");
const emojis = require("../../../src/assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isCommand() &&
      interaction.commandName === "remove_cooldown"
    ) {
      await interaction.deferReply({ ephemeral: true });

      const member = interaction.options.getUser("member");
      const reason = interaction.options.getString("reason");

      const perms = [`${config.devRole}`, `${config.devRoleTest}`];
      let staff = guild.members.cache.get(interaction.user.id);
      if (staff.roles.cache.hasAny(...perms)) {
        // Send Echo Message To Mentioned Room
        const memberTarget = interaction.guild.members.cache.get(member.id);

        // Check if the member is in cooldown
        const existingCooldown = await Cooldown.findOne({
          userId: member.id,
        });

        if (!existingCooldown) {
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.cooldown} Remove Cooldown!`,
                description: `${emojis.threadMark} ${memberTarget} is not in cooldown.`,
                color: color.gray,
              },
            ],
            ephemeral: true,
          });
          return;
        }

        // Create confirmation buttons
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("#confirm")
            .setLabel(
              `Confirm removing ${memberTarget.user.username}'s cooldown`,
            )
            .setStyle(2)
            .setEmoji(emojis.check),
          new MessageButton()
            .setCustomId("#cancel")
            .setLabel("Cancel")
            .setStyle(2)
            .setEmoji(emojis.cross),
        );

        // Send the confirmation embed and buttons
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.cooldown} Remove Cooldown!`,
              description: `${emojis.threadMark} Are you sure you want to remove the cooldown from ${memberTarget}?`,
              color: color.gray,
            },
          ],
          components: [row],
          ephemeral: true,
        });

        // Handle button interactions
        const filter = (i) =>
          i.customId === "#confirm" || i.customId === "#cancel";

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 50 * 1000, // Time in milliseconds for how long the collector should last
        });

        collector.on("collect", async (i) => {
          if (i.customId === "#confirm") {
            // User clicked on Confirm button
            // Implement the logic to remove the cooldown here

            try {
              const cooldown = await Cooldown.findOneAndDelete({
                userId: member.id,
              });
              if (cooldown) {
                const role = guild.roles.cache.get(cooldown.roleId);
                if (role) {
                  await memberTarget.roles.remove(role);

                  await memberTarget.send({
                    embeds: [
                      new MessageEmbed()
                        .setColor(color.gray)
                        .setTitle(`${emojis.alert} Cooldown Removed`)
                        .setDescription(
                          `${emojis.threadMark} Your cooldown has been removed by ${interaction.user}.`,
                        ),
                    ],
                  });

                  await interaction.editReply({
                    embeds: [
                      {
                        title: `${emojis.check} Cooldown Removed`,
                        description: `${emojis.threadMark} ${memberTarget}'s cooldown has been removed.`,
                        color: color.gray,
                      },
                    ],
                    components: [],
                    ephemeral: true,
                  });
                } else {
                  await interaction.editReply({
                    embeds: [
                      {
                        title: `${emojis.warning} Error`,
                        description: `${emojis.threadMark} The cooldown role was not found. Please contact the developer.`,
                        color: color.gray,
                      },
                    ],
                    components: [],
                    ephemeral: true,
                  });
                }
                /// Send message to log channel after freezing member ///
                const log = interaction.guild.channels.cache.get(config.log);
                await log.send({
                  embeds: [
                    {
                      title: `${emojis.log} Cooldown Log`,
                      description: `${emojis.cooldown} ${memberTarget}'s cooldown removed by ${interaction.user}`,
                      color: color.gray,
                      fields: [
                        {
                          name: `${emojis.reason} Removal Reason`,
                          value:
                            `${emojis.threadMark} ${reason}` ||
                            `${emojis.threadMark} No Reason Found`,
                          inline: false,
                        },
                      ],
                      timestamp: new Date(),
                      footer: {
                        text: "Cooldown removed in",
                        icon_url: client.user.displayAvatarURL({
                          dynamic: true,
                        }),
                      },
                    },
                  ],
                  //this is the important part
                  ephemeral: false,
                });
              } else {
                await interaction.editReply({
                  embeds: [
                    {
                      title: `${emojis.cooldown} Confirmation`,
                      description: `${emojis.threadMark} ${memberTarget} was not in cooldown before.`,
                      color: color.gray,
                    },
                  ],
                  components: [],
                  ephemeral: true,
                });
              }
            } catch (error) {
              console.error(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m Error removing cooldown role:`,
                `\x1b[33m ${error.message}`,
              );
              await interaction.editReply({
                embeds: [
                  {
                    title: `${emojis.warning} Confirmation`,
                    description: `${emojis.threadMark} An error occurred while removing cooldown role from ${memberTarget}.`,
                    color: color.gray,
                  },
                ],
                components: [],
                ephemeral: true,
              });
            }

            // Stop the collector
            collector.stop();
          } else if (i.customId === "#cancel") {
            // User clicked on Cancel button
            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.cross} Confirmation`,
                  description: `${emojis.threadMark} Cooldown removal of ${memberTarget} has been canceled.`,
                  color: color.gray,
                },
              ],
              components: [],
              ephemeral: true,
            });

            // Stop the collector
            collector.stop();
          }
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            // Collector ended due to timeout
            interaction.editReply({
              embeds: [
                {
                  title: `${emojis.cross} Timeout!`,
                  description: `${emojis.threadMark} Confirmation timeout. Cooldown removal canceled.`,
                  color: color.gray,
                },
              ],
              components: [],
              ephemeral: true,
            });
          }
        });
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
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Permission denied`,
        );
      }
    }
  });
};
