const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
const Cooldown = require("../../../src/database/models/CooldownModel");
const color = require("../../../src/assest/color.js");
const banners = require("../../../src/assest/banners.js");
const emojis = require("../../../src/assest/emojis");
const errors = require("../../../src/assest/errors.js");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "add_cooldown") {
      const member = interaction.options.getUser("member");
      const reason = interaction.options.getString("reason");
      const duration = interaction.options.getInteger("duration");
      const durationType = interaction.options.getString("type"); // Minutes, Hours, Days

      await interaction.deferReply({ ephemeral: true });

      const perms = [`${config.devRole}`, `${config.devRoleTest}`];
      let staff = guild.members.cache.get(interaction.user.id);

      if (staff.roles.cache.hasAny(...perms)) {
        const memberTarget = interaction.guild.members.cache.get(member.id);

        if (memberTarget && !memberTarget.roles.cache.hasAny(config.coolDown)) {
          try {
            const expiryDate = new Date();
            switch (durationType) {
              case "minutes":
                expiryDate.setMinutes(expiryDate.getMinutes() + duration);
                break;
              case "hours":
                expiryDate.setHours(expiryDate.getHours() + duration);
                break;
              case "days":
                expiryDate.setDate(expiryDate.getDate() + duration);
                break;
              case "months":
                expiryDate.setMonth(expiryDate.getMonth() + duration);
                break;
              default:
                break;
            }

            const existingRole = await Cooldown.findOne({
              userId: member.id,
            });

            if (!existingRole) {
              // Create confirmation buttons
              const row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("#confirm")
                  .setLabel(
                    `Confirm adding cooldown to ${memberTarget.user.username}`,
                  )
                  .setStyle(2)
                  .setEmoji(emojis.check),
                new MessageButton()
                  .setCustomId("#cancel")
                  .setLabel("Cancel")
                  .setStyle(2)
                  .setEmoji(emojis.cross),
              );

              await interaction.editReply({
                embeds: [
                  {
                    title: `${emojis.warning} Warning!`,
                    description: `${emojis.threadMark} Are you sure you wants to add ${duration} ${durationType} cooldown to ${memberTarget}?`,
                    color: color.gray,
                  },
                ],
                components: [row],
                ephemeral: true,
              });

              const filter = (i) =>
                i.customId === "#confirm" || i.customId === "#cancel";

              const collector =
                interaction.channel.createMessageComponentCollector({
                  filter,
                  time: 30 * 1000, // Adjust the time as needed
                });

              collector.on("collect", async (i) => {
                collector.stop();

                if (i.customId === "#confirm") {
                  try {
                    await memberTarget.roles.add(config.coolDown);

                    await Cooldown.create({
                      userId: memberTarget.id,
                      guildId: guild.id,
                      roleId: config.coolDown,
                      expiry: expiryDate,
                    });

                    await memberTarget.send({
                      embeds: [
                        new MessageEmbed()
                          .setColor(color.gray)
                          .setTitle(`${emojis.warning} Warning!`)
                          .setDescription(
                            `${emojis.threadMark} Staff member added a cooldown period to you.`,
                          )
                          .addFields(
                            {
                              name: `${emojis.lastUpdate} Cooldown Duration Ends`,
                              value: `${emojis.threadMark} <t:${Math.floor(
                                expiryDate / 1000,
                              )}:R>`,
                              inline: false,
                            },
                            {
                              name: `${emojis.warning} Reason`,
                              value: `${emojis.threadMark} ${reason}`,
                              inline: false,
                            },
                          ),
                      ],
                    });

                    const log = interaction.guild.channels.cache.get(
                      config.log,
                    );
                    await log.send({
                      embeds: [
                        {
                          title: `${emojis.log} Cooldown Add Log`,
                          description: `${emojis.snow} ${interaction.user} added cooldown to ${memberTarget}`,
                          color: color.gray,
                          fields: [
                            {
                              name: `${emojis.reason} Cooldown Reason`,
                              value: `${emojis.threadMark} ${reason}`,
                              inline: false,
                            },
                            {
                              name: `${emojis.lastUpdate} End Date`,
                              value: `${emojis.threadMark} <t:${Math.floor(
                                expiryDate / 1000,
                              )}:R> ${emojis.pinkDot} <t:${Math.floor(
                                expiryDate / 1000,
                              )}:F>`,
                              inline: false,
                            },
                          ],
                          timestamp: new Date(),
                          footer: {
                            text: "Cooldown was added in",
                            icon_url: banners.parfaitIcon,
                          },
                        },
                      ],
                      ephemeral: false,
                      components: [],
                    });

                    await interaction.editReply({
                      embeds: [
                        {
                          title: `${emojis.check} Cooldown Added!`,
                          description: `${
                            emojis.threadMarkmid
                          } The cooldown has been added to ${memberTarget}\n${
                            emojis.threadMark
                          } The cooldown period ends <t:${Math.floor(
                            expiryDate / 1000,
                          )}:R> <t:${Math.floor(expiryDate / 1000)}:f>`,
                          color: color.gray,
                        },
                      ],
                      ephemeral: true,
                      components: [],
                    });
                  } catch (error) {
                    console.error(
                      "Error giving temporary role:",
                      error.message,
                    );
                    await interaction.editReply({
                      embeds: [
                        {
                          title: `${emojis.warning} Oops!`,
                          description: `${emojis.threadMark} An error occurred while giving the cooldown.`,
                          color: color.gray,
                        },
                      ],
                      ephemeral: true,
                      components: [],
                    });
                  }
                } else {
                  await interaction.editReply({
                    embeds: [
                      {
                        title: `${emojis.warning} Cancelled!`,
                        description: `${emojis.threadMark} The Cooldown addition canceled.`,
                        color: color.gray,
                      },
                    ],
                    ephemeral: true,
                    components: [],
                  });
                }
              });

              collector.on("end", (collected, reason) => {
                if (reason === "time") {
                  interaction.editReply({
                    embeds: [
                      {
                        title: `${emojis.warning} Cancelled!`,
                        description: `${emojis.threadMark} Confirmation timeout. Cooldown addition canceled.`,
                        color: color.gray,
                      },
                    ],
                    ephemeral: true,
                    components: [],
                  });
                }
              });
            }
          } catch (error) {
            console.error("Error giving temporary role:", error.message);
            await interaction.editReply({
              embeds: [
                {
                  title: `${emojis.warning} Cancelled!`,
                  description: `${emojis.threadMark} An error occurred while giving the cooldown.`,
                  color: color.gray,
                },
              ],
              ephemeral: true,
              components: [],
            });
          }
        } else {
          const existingRole = await Cooldown.findOne({
            userId: memberTarget.id,
          });
          const duration = existingRole.expiry;
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.warning} Oops!`,
                description: `${
                  emojis.threadMark
                } ${memberTarget} is already in a cooldown period that ends <t:${Math.floor(
                  duration / 1000,
                )}:R>`,
                color: color.gray,
              },
            ],
            ephemeral: true,
            components: [],
          });
        }
      } else {
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Permission Denied!`,
              description: errors.permsError,
              color: color.gray,
            },
          ],
          ephemeral: true,
          components: [],
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
