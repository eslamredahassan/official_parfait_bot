module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    client.on("messageCreate", async (message) => {
      // Check if the message is from a user and not a bot
      if (
        !message.author.bot &&
        message.channel.type === "text" &&
        message.isThread()
      ) {
        // Check if the message content is a command to start the interaction
        if (message.content.toLowerCase() === "!apply") {
          // Initialize an object to store user responses
          const userResponses = {};

          let questions = {
            q1: "Please send a screenshot from your in-game profile here",
            q2: `Tell us when you are available for a tryout by our staff`,
            q3: "What are your usual days of play and hours?",
            q4: "Have you joined any clan before?",
            q5: "Where are you from?",
            q6: "When did you start playing Smash Legends?",
            q7: "Have you read the requirements?",
          };

          // Ask the questions
          for (const [key, question] of Object.entries(questions)) {
            await message.channel.send(question);

            // Define a filter to listen for the user's response
            const filter = (response) =>
              response.author.id === message.author.id;

            // Set a timeout for 15 minutes (900000 milliseconds)
            const timeout = 900000; // 15 minutes in milliseconds

            // Wait for the user's response
            await message.channel
              .awaitMessages({
                filter,
                max: 1,
                time: timeout,
                errors: ["time"],
              })
              .then((collected) => {
                // User answered within the time limit
                userResponses[key] = collected.first().content;
              })
              .catch((error) => {
                // User did not answer within the time limit
                message.channel.send("Time's up! You didn't answer in time.");
                return; // Stop further processing if the user didn't answer all questions
              });
          }

          // Display collected responses
          message.channel.send(
            "Application submitted! Here are your responses:",
          );
          for (const [key, response] of Object.entries(userResponses)) {
            message.channel.send(`**${questions[key]}:** ${response}`);
          }
        }
      }
    });
  });
};
