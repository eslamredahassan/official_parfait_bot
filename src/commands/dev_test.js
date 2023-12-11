const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const banners = require("../assest/banners.js");

registerFont("./src/assest/fonts/BebasNeue-Regular.otf", {
  family: "BebasNeue Regular",
});
registerFont("./src/assest/fonts/venusRisingRG.otf", {
  family: "Venus Rising",
});

const legendImages = [
  "./src/assest/images/legends/parfait.png",
  "./src/assest/images/legends/ali.png",
  "./src/assest/images/legends/timun.png",
  "./src/assest/images/legends/aoi.png",
  "./src/assest/images/legends/robin.png",
  "./src/assest/images/legends/zeppetta.png",
  "./src/assest/images/legends/rapunzel.png",
  "./src/assest/images/legends/alice.png",
  "./src/assest/images/legends/brick.png",
  "./src/assest/images/legends/cat.png",
  "./src/assest/images/legends/cindy.png",
  "./src/assest/images/legends/donq.png",
  "./src/assest/images/legends/ducky.png",
  "./src/assest/images/legends/flare.png",
  "./src/assest/images/legends/goldie.png",
  "./src/assest/images/legends/gumi.png",
  "./src/assest/images/legends/hook.png",
  "./src/assest/images/legends/jacko.png",
  "./src/assest/images/legends/kaiser.png",
  "./src/assest/images/legends/Kurenai.png",
  "./src/assest/images/legends/loren.png",
  "./src/assest/images/legends/maya.png",
  "./src/assest/images/legends/molly.png",
  "./src/assest/images/legends/nui.png",
  "./src/assest/images/legends/octavia.png",
  "./src/assest/images/legends/peter.png",
  "./src/assest/images/legends/queen.png",
  "./src/assest/images/legends/rambert.png",
  "./src/assest/images/legends/ravi.png",
  "./src/assest/images/legends/red.png",
  "./src/assest/images/legends/snow.png",
  "./src/assest/images/legends/victor.png",
  "./src/assest/images/legends/wolf.png",
  "./src/assest/images/legends/wukong.png",
  "./src/assest/images/legends/yong.png",
  "./src/assest/images/legends/lettuce.png",
  "./src/assest/images/legends/marina.png",
  // Add more image URLs as needed
];

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "dev_test") {
      let guild = client.guilds.cache.get(config.guildID);
      await interaction.deferReply({ ephemeral: true });

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

        const legendIndex = Math.floor(Math.random() * legendImages.length);
        const legends = await loadImage(legendImages[legendIndex]);
        ctx.drawImage(legends, 83, 50, 617, 631);

        const smallX = await loadImage("./src/assest/images/small_X.png");
        ctx.drawImage(smallX, 43, 650, 85, 85);

        ctx.fillStyle = "#d9507c";
        ctx.font = `42px BebasNeue Regular`;
        ctx.fillText(`jzso84o0q`, 509, 460);

        ctx.fillStyle = "#ffffff";
        ctx.font = `42px BebasNeue Regular`;
        ctx.fillText(`SMASH CODE`, 340, 460);

        ctx.fillStyle = "#ffffff";
        ctx.font = `28px BebasNeue Regular`;
        ctx.translate(340, 460); // Set the rotation point
        ctx.rotate(-Math.PI / 2); // Rotate the text by -90 degrees
        ctx.fillText(`I`, -176, -268); // Position text
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformations

        ctx.fillStyle = "#1f1f25";
        ctx.font = `27px BebasNeue Regular`;
        ctx.translate(340, 460); // Set the rotation point
        ctx.rotate(-Math.PI / 2); // Rotate the text by -90 degrees
        ctx.fillText(`${interaction.guild.name}`, -168, -268); // Position text
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformations

        const username = interaction.user.username.toUpperCase();
        const usernameLength = username.length;
        let fontSize = 63;
        let y = 420;

        if (usernameLength > 9) {
          fontSize = 41;
          y = 419;
        }

        ctx.fillStyle = "#ffae00";
        ctx.font = `${fontSize}px Venus Rising`;

        const textWidth = ctx.measureText(username).width;
        const x = (canvas.width - textWidth) / 2;

        ctx.fillText(`${username}`, x, y);

        ctx.fillStyle = "#ffffff";
        ctx.font = `12px BebasNeue Regular`;
        ctx.fillText(`ALL RIGHTS SAVED TO IEGYGAMERI AND SUN&CO`, 299, 760);

        const avatarURL = interaction.user.displayAvatarURL({
          format: "jpg",
        });

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          username + "-card.png",
        );
        await interaction.followUp({ files: [attachment] });
      } catch (error) {
        console.error(error.message);
      }
    }
  });
};
