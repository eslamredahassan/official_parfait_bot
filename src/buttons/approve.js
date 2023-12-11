const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");

const fs = require("fs");
const path = require("path");
const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const messages = require("../assest/messages.js");
const fieldsText = require("../assest/fieldsText.js");
const banners = require("../assest/banners.js");
const errors = require("../assest/errors.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

// Database Schemas
const Application = require("../../src/database/models/application");

// Specify the folder where your legend images are stored
const legendsFolderPath = "./src/assest/images/legends/";
// Read the file names from the folder
const legendImageFiles = fs.readdirSync(legendsFolderPath);
// Create the legendImages array by mapping the file names to their full paths
const legendImages = legendImageFiles.map((fileName) =>
  path.join(legendsFolderPath, fileName),
);

registerFont("./src/assest/fonts/BebasNeue-Regular.otf", {
  family: "BebasNeue Regular",
});
registerFont("./src/assest/fonts/venusRisingRG.otf", {
  family: "Venus Rising",
});

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "#ap_approve") {
      try {
        await interaction.deferReply({ ephemeral: true });

        const perms = [`${config.devRole}`, `${config.STAFF}`];
        let staff = guild.members.cache.get(interaction.user.id);
        if (staff.roles.cache.hasAny(...perms)) {
          // get the user id from his application embed
          const ID = interaction.message.embeds[0].footer.text;
          const ap_user = await interaction.guild.members.fetch(ID);

          let applyChannel = interaction.guild.channels.cache.get(
            config.applyChannel,
          );
          const log = interaction.guild.channels.cache.get(config.log);
          /// Send the action to the console log
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${ap_user.user.username}`,
            `\x1b[32m APPROVED BY ${interaction.user.username}`,
          );
          //// Add roles to the user
          await ap_user.roles.add([config.SunTest, config.SquadSUN]);
          const SunTest = interaction.guild.roles.cache.get(config.SunTest);
          const SquadSUN = interaction.guild.roles.cache.get(config.SquadSUN);
          // Remove roles from the user
          await ap_user.roles.remove(config.waitRole);
          // Send a direct message to the user
          await ap_user.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emojis.s_parfait} Welcome in SUN Clan`)
                .setImage(banners.acceptBanner)
                .setDescription(messages.acceptMessage)
                .addFields([
                  {
                    name: `${emojis.apply} Clan Code`,
                    value: fieldsText.clanCode,
                    inline: false,
                  },
                  {
                    name: `${emojis.alert} Most Important Rules`,
                    value: fieldsText.dmWarning,
                    inline: false,
                  },
                ]),
            ],
            components: [],
          });
          // Save the channel id after find it
          const recruitmentChannel = interaction.guild.channels.cache.get(
            config.recruitmentChannel,
          );
          // Save the channel id after find it
          const announces = interaction.guild.channels.cache.get(
            config.announcesChannel,
          );
          // Send a message to the channel
          const msg_one = await recruitmentChannel.send(
            `<:SPice:1080958776351399976> Welcome ${ap_user} in **SUN** :partying_face:`,
          );
          var Emojis = [emojis.s_parfait, emojis.f_parfait];
          for (var i = 0; i < Emojis.length; i++) {
            var React = Emojis[i];
            // add reactions to the message
            await msg_one.react(React);
          }
          // Get the user application from database
          const applicationData = await Application.findOne({
            userId: ap_user.id,
          });
          const userCode = applicationData.user_code; // Adjust field name as per your database schem

          try {
            const canvas = createCanvas(769, 769);
            const ctx = canvas.getContext("2d");
            const background = await loadImage(
              "./src/assest/images/background.png",
            );
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const bigX = await loadImage("./src/assest/images/colored_X.png");
            ctx.drawImage(bigX, 493, 493, 276, 276);

            const small_white_X = await loadImage(
              "./src/assest/images/small_white_X.png",
            );
            ctx.drawImage(small_white_X, 303, 75, 85, 85);
            // Pick randome image from legends folder
            const legendIndex = Math.floor(Math.random() * legendImages.length);
            const legends = await loadImage(legendImages[legendIndex]);
            ctx.drawImage(legends, 83, 50, 617, 631);

            const smallX = await loadImage("./src/assest/images/small_X.png");
            ctx.drawImage(smallX, 43, 650, 85, 85);
            // Set text color
            ctx.fillStyle = "#d9507c";
            // Set text size and font type
            ctx.font = `42px BebasNeue Regular`;
            // Set text and the position
            ctx.fillText(userCode, 509, 460);

            // Set text color
            ctx.fillStyle = "#ffffff";
            // Set text size and type
            ctx.font = `42px BebasNeue Regular`;
            // Set the text and the position
            ctx.fillText(`SMASH CODE`, 340, 460);

            // Set text color
            ctx.fillStyle = "#ffffff";
            //set text size and font type
            ctx.font = `28px BebasNeue Regular`;
            // Set the rotation point
            ctx.translate(340, 460);
            // Rotate the text by -90 degrees
            ctx.rotate(-Math.PI / 2);
            // Position text
            ctx.fillText(`I`, -176, -268);
            // Reset the transformations
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Set text color
            ctx.fillStyle = "#1f1f25";
            // Set text size and type
            ctx.font = `27px BebasNeue Regular`;
            // Set the rotation point
            ctx.translate(340, 460);
            // Rotate the text by -90 degrees
            ctx.rotate(-Math.PI / 2);
            // Set text and the position
            ctx.fillText(interaction.guild.name, -168, -268);
            // Reset the transformations
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Set Username in caps
            const username = ap_user.user.username.toUpperCase();
            const usernameLength = username.length;
            let fontSize = 63;
            let y = 420;
            // Handle username length
            if (usernameLength > 9) {
              fontSize = 41;
              y = 419;
            }
            // Set text color
            ctx.fillStyle = "#ffae00";
            // Set text size and type
            ctx.font = `${fontSize}px Venus Rising`;
            // Set text position to center
            const textWidth = ctx.measureText(username).width;
            const x = (canvas.width - textWidth) / 2;
            ctx.fillText(username, x, y);
            // Set text color
            ctx.fillStyle = "#ffffff";
            // Set text size and type
            ctx.font = `12px BebasNeue Regular`;
            // Set text and the position
            ctx.fillText(`ALL RIGHTS SAVED TO IEGYGAMERI AND SUN&CO`, 299, 760);
            // Finish the process
            const attachment = new MessageAttachment(
              canvas.toBuffer(),
              interaction.guild.name +
                "New-member" +
                username +
                userCode +
                "-card.png",
            );
            const announcesMessage = await announces.send({
              content: `Welcome ${ap_user} in **SUN** <@&${config.SquadSUN}> :partying_face:`,
              files: [attachment],
            });
            var Emojis = [emojis.s_parfait, emojis.f_parfait];
            for (var i = 0; i < Emojis.length; i++) {
              var React = Emojis[i];
              await announcesMessage.react(React);
            }
          } catch (error) {
            console.error("Error in welcome poster:", error.message);
          }

          const userName = ap_user.user.username;
          const threadName = applyChannel.threads.cache.find(
            (x) => x.name === `${"🧤︱" + userName + " Tryout"}`,
          );
          /// Rename The Thread
          await threadName.setName("🧤︱" + userName + " Approved");
          // Wait 1 seconds
          await wait(1000);
          /// Lock the thread
          await threadName.setLocked(true);
          // Wait 2 seconds
          await wait(2000);
          /// Archive the thread
          await threadName.setArchived(true);

          let promote = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_promote")
              .setLabel(`Promote ${ap_user.user.username}`)
              .setEmoji(emojis.promote),
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_apologize")
              .setLabel(`Apologize`)
              .setEmoji(emojis.apologize),
            new MessageButton()
              .setStyle("SECONDARY")
              .setDisabled(false)
              .setCustomId("#ap_reply")
              .setLabel(``)
              .setEmoji(emojis.dm),
            new MessageButton()
              .setStyle(4) //-->> Red Color
              .setCustomId("#ap_freeze")
              .setLabel(``)
              .setEmoji(emojis.freeze),
          ]);

          let embed = new MessageEmbed(interaction.message.embeds[0])
            .setTitle(`${emojis.alert} Approved by ${interaction.user.tag}`)
            .setColor(color.gray)
            .setImage(banners.acceptFinishbanner)
            .setThumbnail(banners.acceptIcon)
            .setTimestamp();

          await interaction.message.edit({
            embeds: [embed],
            components: [promote],
          });
          // Send message to log channel
          await log.send({
            embeds: [
              {
                title: `${emojis.log} Approvement Log`,
                description: `${emojis.check} ${ap_user} have been approved by ${interaction.user}`,
                color: color.gray,
                timestamp: new Date(),
                footer: {
                  text: "Approved in",
                  icon_url: banners.parfaitIcon,
                },
              },
            ],
            //this is the important part
            ephemeral: false,
          });
          const applicationStatus = await Application.findOneAndUpdate({
            userId: ap_user.id,
            $set: { status: "Approved" }, // Change "status" to the field you want to update
            new: true,
          });
          //// Send message after accepting member ///
          await interaction.editReply({
            embeds: [
              {
                title: `${emojis.check} Approvement Alert`,
                description: `${emojis.threadMarkmid} You've approved ${ap_user} application\n${emojis.threadMark} His thread will be automatically archived`,
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
            .catch((error) =>
              console.error(
                "Error in permission interaction reply:",
                error.message,
              ),
            );
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Permission denied`,
          );
        }
      } catch (error) {
        console.error("Error in approve script:", error.message);
        await interaction.editReply({
          embeds: [
            {
              title: `${emojis.warning} Oops!`,
              description: `${emojis.threadMark} Something went wrong while approving the application.`,
              color: color.gray,
            },
          ],
          //this is the important part
          ephemeral: true,
        });
      }
    }
  });
};
