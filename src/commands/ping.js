const moment = require("moment");
const wait = require("util").promisify(setTimeout);

const emojis = require("../assest/emojis");
const color = require("../assest/color");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "ping") {
      try {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        const latency = Date.now() - interaction.createdTimestamp;

        await wait(3000);
        interaction.editReply({
          embeds: [
            {
              //title: `${emojis.check} Successfully Removed`,
              description: `${
                emojis.time
              } Parfait Latency is \`\`${latency}\`\` ms ${
                emojis.pinkDot
              } API Latency is \`\`${Math.round(client.ws.ping)}\`\` ms`,
              color: color.gray,
            },
          ],
          ephemeral: true,
        });
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("lll")}`,
          `\x1b[31m ${interaction.user.username} USED`,
          `\x1b[35m Ping Command`,
          `\x1b[36m ${latency} ms `,
          `\x1b[35m API ${Math.round(client.ws.ping)} ms`,
        );
      } catch (error) {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("lll")}`,
          `\x1b[31m Error in ping command:`,
          `\x1b[34m ${error.message}`,
        );
        interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Error`,
              description: `${emojis.threadMark} something went wrong while executing this command`,
              color: color.gray,
            },
          ],
          ephemeral: true,
        });
      }
    }
  });
};
