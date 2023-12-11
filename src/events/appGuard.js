const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const Application = require("../../src/database/models/application");
const Cooldown = require("../../src/database/models/CooldownModel");

const banners = require("../assest/banners.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  setInterval(async () => {
    try {
      const guild = client.guilds.cache.get(config.guildID);
      const applications = await Application.find();

      for (const application of applications) {
        const channel = guild.channels.cache.get(config.finishChannel);
        const message = await channel.messages.fetch(application.application);

        if (!message) {
          // The message has already been deleted
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Application not found for application ID:`,
            `\x1b[34m ${application._id}`,
          );
          continue;
        }

        // Check if the application has already been processed (deleted)
        const existingApp = await Application.findById(application._id);
        if (!existingApp) {
          // The application has already been processed
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Application with ID:`,
            `\x1b[34m ${application._id}`,
            `\x1b[35m has already been processed.`,
          );
          continue;
        }

        try {
          const member = guild.members.cache.get(application.userId);
          // If member is not found in cache, fetch to verify
          if (!member) {
            const fetchedMember = await guild.members
              .fetch(application.userId)
              .catch(() => null);

            if (!fetchedMember) {
              const expiryInDays = 60; // Role expires in 30 days
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + expiryInDays);

              const Cooldown = new Cooldown({
                userId: application.userId,
                guildId: guild.id,
                roleId: config.coolDown,
                expiry: expiryDate,
              });

              try {
                await Cooldown.save();
              } catch (error) {
                console.log(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m An error occurred while saving the temporary role:`,
                  `\x1b[34m ${error.message}`,
                );
              }

              let embed = new MessageEmbed(message.embeds[0])
                .setTitle(`${emojis.alert} ${application.username} Left SUN`)
                .setColor(color.gray)
                .setImage(banners.canceled)
                .setThumbnail(canceledIcon)
                .setTimestamp();
              /// Edit Review Embed ///
              await message
                .edit({
                  embeds: [embed],
                  components: [],
                })
                .then((msg) => msg.unpin());

              const applyChannel = guild.channels.cache.get(
                config.applyChannel,
              );
              if (!applyChannel) {
                console.log(
                  `\x1b[0m`,
                  `\x1b[33m 〢`,
                  `\x1b[33m ${moment(Date.now()).format("LT")}`,
                  `\x1b[31m Apply Channel`,
                  `\x1b[34m NOT FOUND`,
                );
                continue; // Skip the rest of the loop iteration
              }
              const thread = await applyChannel.threads.fetch(
                application.thread,
              );
              /// Rename the thread ///
              await thread.setName(
                "🧤︱" + `${application.username}` + " Canceled",
              );
              /// Lock the thread ///
              await wait(2000); // ** cooldown 10 seconds ** \\
              await thread.setLocked(true);
              /// Archive the thread ///
              await wait(4000); // ** cooldown 10 seconds ** \\
              await thread.setArchived(true);
              // Remove the entry from the database
              await Application.findByIdAndDelete(application._id);
              console.log(
                `\x1b[0m`,
                `\x1b[33m 〢`,
                `\x1b[33m ${moment(Date.now()).format("LT")}`,
                `\x1b[31m ${application.username}'s`,
                `\x1b[34m Application has been canceled`,
              );
            }
          }
        } catch (error) {
          console.error(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error:`,
            `\x1b[34m ${error.message}`,
          );
        }
      }
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in app guard:`,
        `\x1b[34m ${error.message}`,
      );
    }
  }, 25 * 1000); // Check every 5 seconds
};
