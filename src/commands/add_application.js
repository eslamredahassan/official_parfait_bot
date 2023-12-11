const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");

const moment = require("moment");
require("moment-duration-format");
const fs = require("fs");

const settings = JSON.parse(fs.readFileSync("./src/assest/settings.json"));
const color = settings.colors;
const emojis = settings.emojis;
const banners = settings.banners;

// Database Schemas
const Application = require("../../src/database/models/application");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isCommand() &&
      interaction.commandName === "add_application"
    ) {
      console.log(
        `\x1b[0m`,
        `\x1b[31m 〢`,
        `\x1b[33m ${moment(Date.now()).format("lll")}`,
        `\x1b[34m ${interaction.user.username} USED`,
        `\x1b[35m Message Dev Command`,
      );
      //// Modal application code ///
      let addApp_modal = new Modal()
        .setTitle(`📧 Add Application to database`)
        .setCustomId(`addApp_modal`);

      const user_code = new TextInputComponent()
        .setCustomId("ap_usercode")
        .setLabel(`Smash Code`.substring(0, 45))
        .setMinLength(9)
        .setMaxLength(9)
        .setValue("jzso84o0q")
        .setRequired(true)
        .setPlaceholder(`Example: jzso84o0q`)
        .setStyle(1);

      const user_age = new TextInputComponent()
        .setCustomId("ap_userage")
        .setLabel(`How old are You`.substring(0, 45))
        .setMinLength(1)
        .setMaxLength(2)
        .setValue("27")
        .setRequired(true)
        .setPlaceholder(`Example: 18`)
        .setStyle(1);

      const user_ct = new TextInputComponent()
        .setCustomId("ap_userct")
        .setLabel(
          `Do you want to join competitions/trainings ?`.substring(0, 45),
        )
        .setMinLength(2)
        .setMaxLength(3)
        .setValue("Yes")
        .setRequired(true)
        .setPlaceholder(`Answer with Yes or No`)
        .setStyle(1);

      const user_legends = new TextInputComponent()
        .setCustomId("ap_userlegends")
        .setLabel(`What are your favorite legends ?`.substring(0, 45))
        .setMinLength(4)
        .setMaxLength(100)
        .setValue("Peter, Ravi, Alice, Zeppetta")
        .setRequired(true)
        .setPlaceholder(`Example: Peter, Robin, Cindy, Victor`)
        .setStyle(2);

      const user_why = new TextInputComponent()
        .setCustomId("ap_userwhy")
        .setLabel(`What can you bring to SUN ?`.substring(0, 45))
        .setMinLength(4)
        .setMaxLength(100)
        .setValue("Developing Parfait bot")
        .setRequired(true)
        .setPlaceholder(`Answer here`)
        .setStyle(2);

      let row_usercode = new MessageActionRow().addComponents(user_code);
      let row_userage = new MessageActionRow().addComponents(user_age);
      let row_userct = new MessageActionRow().addComponents(user_ct);
      let row_userlegends = new MessageActionRow().addComponents(user_legends);
      let row_userwhy = new MessageActionRow().addComponents(user_why);
      addApp_modal.addComponents(
        row_usercode,
        row_userage,
        row_userct,
        row_userlegends,
        row_userwhy,
      );
      await interaction.showModal(addApp_modal);
    }

    if (interaction.customId === "addApp_modal") {
      let user_code = interaction.fields.getTextInputValue("ap_usercode");
      let user_age = interaction.fields.getTextInputValue("ap_userage");
      let user_ct = interaction.fields.getTextInputValue("ap_userct");
      let user_legends = interaction.fields.getTextInputValue("ap_userlegends");
      let user_why = interaction.fields.getTextInputValue("ap_userwhy");

      const newApplication = new Application({
        userCode: user_code,
        userAge: parseInt(user_age), // Assuming userAge is a number
        userCT: user_ct,
        userLegends: user_legends,
        userWhy: user_why,
      });

      // Save the new application data to the database
      try {
        await newApplication.save();
        console.log("Application data saved to the database:", newApplication);
      } catch (error) {
        console.error("Error saving application data:", error.message);
        // Handle the error accordingly
      }

      let dmDevChannel = client.channels.cache.get(config.dmDevChannel);
      if (!dmDevChannel) return;

      const reply = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle(2)
          .setCustomId("#profile")
          .setLabel(`Reply ${interaction.user.username}`)
          .setEmoji(emojis.dm),
      ]);

      await interaction.reply({
        embeds: [
          {
            title: `${emojis.check} Your message sent has been sent to my developer`,
            description: `- Thank you ${interaction.user} Your message will be answered soon if necessary`,
            color: color.gray,
            ///thumbnail: { url: 'https://i.imgur.com/FiSTCop.png', },
            image: { url: banners.channelMessageBanner },
          },
        ],
        //this is the important part
        ephemeral: true,
        components: [],
      });
    }
  });
};
