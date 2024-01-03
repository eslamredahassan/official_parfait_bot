const { Client, ActivityType } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const config = require("../config");
const moment = require("moment");

const Counter = require("../../src/database/models/counter");

module.exports = async (client, config) => {
  const counter = await Counter.findOne();
  const counterValue = counter ? counter.count : 0;

  const guild = client.guilds.cache.get(config.guildID);

  // Fetch the squad role
  const squadRole = guild.roles.cache.get(config.SquadSUN);
  const tryoutRole = guild.roles.cache.get(config.waitRole);
  const SunTest = guild.roles.cache.get(config.SunTest);

  const membersCount = guild.memberCount;

  // Function to dynamically update the status
  async function updatePresence() {
    try {
      // Fetch all guild members
      await guild.members.fetch();

      // Filter members based on the squad role
      const squadMembers = guild.members.cache.filter((member) =>
        member.roles.cache.has(squadRole.id),
      );

      // Set the presence directly based on conditions
      await client.user.setPresence({
        activities: [
          {
            name: `with ${membersCount} Smashers`,
            type: "PLAYING",
          },
          {
            name: `${counterValue} Applications`,
            type: "WATCHING",
          },
          {
            name: `With ${squadMembers.size} Sun Members`,
            type: "PLAYING",
          },
          // Add tryout status only if there are tryouts
          ...(tryoutRole.members.size > 0
            ? [
                {
                  name: `${tryoutRole.members.size} Tryouts`,
                  type: "WATCHING",
                },
              ]
            : []),
          // Add SunTest status only if there are players in test
          ...(SunTest.members.size > 0
            ? [
                {
                  name: `${SunTest.members.size} Players in test`,
                  type: "WATCHING",
                },
              ]
            : []),
        ],
        status: "idle",
      });
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in Activity`,
        `\x1b[31m ${error.message}`,
      );
    }
  }

  // Initial presence update
  await updatePresence();

  // Set interval for presence updates
  setInterval(updatePresence, 60 * 1000);

  console.info(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m Parfait Activity`,
    `\x1b[32m UPDATED`,
  );
};
