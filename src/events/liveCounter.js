const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const counter = require("../../src/database/models/counter");
const UI = require("../../src/database/models/userInterface");

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  setInterval(async () => {
    try {
      const appCounter = await counter.findOne();
      const counterValue = appCounter ? appCounter.count : 0;

      const interfaces = await UI.find({ embedId: { $exists: true } });
      const guild = client.guilds.cache.get(config.guildID);
      const squad = guild.roles.cache.get(config.SquadSUN);
      const tryout = guild.roles.cache.get(config.waitRole);

      interfaces.forEach(async (interfaceData) => {
        const applyChannel = client.channels.cache.get(interfaceData.channelId);

        if (applyChannel) {
          applyChannel.messages.fetch(interfaceData.embedId).then((message) => {
            if (message && message.embeds.length > 0) {
              const embed = message.embeds[0];
              const newEmbed = new MessageEmbed(embed);
              newEmbed.setFooter({
                text:
                  `📝` +
                  counterValue +
                  " Applications Received " +
                  `  👤 ${tryout.members.size} Players In Tryout ` +
                  `  👥 ${squad.members.size} Squad SUN`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              });
              message.edit({ embeds: [newEmbed] });
            }
          });
        }
      });
    } catch (error) {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m An Error Occurred in Interval Function:`,
        `\x1b[35m ${error.message}`,
      );
    }
  }, 60 * 1000);
};
