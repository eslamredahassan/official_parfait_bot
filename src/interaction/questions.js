const { MessageActionRow, MessageButton } = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "#thread_start":
          {
            let member = guild.members.cache.get(interaction.user.id);
            if (member.roles.cache.has(config.waitRole)) {
              let controller = new MessageActionRow().addComponents([
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setDisabled(false)
                  .setCustomId("#thread_message_1")
                  .setLabel(`Next`)
                  .setEmoji(emojis.next),
              ]);

              await interaction.update({
                content: `${emojis.pinkDot} Please send a screenshot from your in-game profile here`,
                ephemeral: false,
                components: [controller],
              });
            } else {
              await interaction.reply({
                embeds: [
                  {
                    title: `${emojis.id} Staff Member Detected`,
                    description: `${emojis.whiteDot} Only members who have <@&${config.waitRole}> role can use this`,
                    color: color.gray,
                  },
                ],
                //this is the important part
                ephemeral: true,
              });
            }
          }
          break;
        case "#thread_message_1":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_2")
                .setLabel(`Next`)
                .setEmoji(emojis.next),
            ]);
            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} Tell us when you are available for a tryout by our Staff`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_2":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_3")
                .setLabel(`Next`)
                .setEmoji(emojis.next),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} What are your usual days of play and hours?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_3":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_4")
                .setLabel(`Next`)
                .setEmoji(emojis.next),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} Have you joined any clan before?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_4":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_5")
                .setLabel(`Next`)
                .setEmoji(emojis.next),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} Where are you from?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_5":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_6")
                .setLabel(`Next`)
                .setEmoji(emojis.next),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} When did you start playing Smash Legends?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_6":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_7")
                .setLabel(`Finish`)
                .setEmoji(emojis.check),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} What is the highest rank you have obtained?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;

        case "#thread_message_7":
          {
            let controller = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SECONDARY")
                .setDisabled(false)
                .setCustomId("#thread_message_8")
                .setLabel(`Finish`)
                .setEmoji(emojis.check),
            ]);

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} Have you read the requirements?`,
              ephemeral: false,
              components: [controller],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
        case "#thread_message_8":
          {
            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const threads = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            await threads.sendTyping();
            await wait(1000);

            await threads.send({
              content: `${emojis.pinkDot} Thank you, Now wait for our <@&${config.staffSun}> to manage your tryout time`,
              ephemeral: false,
              components: [],
            });
            await interaction.message.edit({
              conten: "",
              components: [],
            });
          }
          break;
      }
    }
  });
};
