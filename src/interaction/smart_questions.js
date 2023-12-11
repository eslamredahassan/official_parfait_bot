const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

const moment = require("moment");
const wait = require("util").promisify(setTimeout);
const cooldown = new Set();
require("moment-duration-format");

const banners = require("../assest/banners.js");
const errors = require("../assest/errors.js");
const color = require("../assest/color.js");
const emojis = require("../assest/emojis");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  let Logo = guild.iconURL({ dynamic: true });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "#ap_questions":
          {
            console.log(
              `\x1b[31m 〢`,
              `\x1b[33m ${moment(Date.now()).format("lll")}`,
              `\x1b[34m ${interaction.user.username} USED`,
              `\x1b[35m Reply Button`,
            );
            //// Modal application code ///
            let questions = {
              q1: "Please send a screenshot from your in-game profile here",
              q2: `Tell us when you are available for a tryout by our staff`,
              q3: "What are your usual days of play and hours?",
              q4: "Have you joined any clan before?",
              q5: "Where are you from?",
              q6: "When did you start playing Smash Legends?",
              q7: "Have you read the requirements?",
            };

            let applyChannel = interaction.guild.channels.cache.get(
              config.applyChannel,
            );
            if (!applyChannel) return;

            const user = interaction.user;
            const userName = user.username;

            const thread = applyChannel.threads.cache.find(
              (x) => x.name === "🧤︱" + userName + " Tryout",
            );

            const filter = (m) => m.user.id === thread.user.id;
            thread
              .send({ content: `${questions.q1}` })
              .then(async (msg) => {
                await msg.channel
                  .awaitMessages({
                    thread: filter,
                    time: 60000,
                    max: 1,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    const msg1 = collected.first().content;
                    thread
                      .send({ content: `${questions.q2}` })
                      .then(async (msg) => {
                        await msg.channel
                          .awaitMessages({
                            thread: filter,
                            time: 60000,
                            max: 1,
                            errors: ["time"],
                          })
                          .then((collected) => {
                            const msg2 = collected.first().content;
                            thread
                              .send({ content: `${questions.q3}` })
                              .then(async (msg) => {
                                await msg.channel
                                  .awaitMessages({
                                    thread: filter,
                                    time: 60000,
                                    max: 1,
                                    errors: ["time"],
                                  })
                                  .then((collected) => {
                                    const msg3 = collected.first().content;
                                    thread
                                      .send({ content: `${questions.q4}` })
                                      .then(async (msg) => {
                                        await msg.channel
                                          .awaitMessages({
                                            thread: filter,
                                            time: 60000,
                                            max: 1,
                                            errors: ["time"],
                                          })
                                          .then((collected) => {
                                            const msg4 =
                                              collected.first().content;
                                            thread
                                              .send({
                                                content: `${questions.q5}`,
                                              })
                                              .then(async (msg) => {
                                                await msg.channel
                                                  .awaitMessages({
                                                    thread: filter,
                                                    time: 60000,
                                                    max: 1,
                                                    errors: ["time"],
                                                  })
                                                  .then((collected) => {
                                                    const msg5 =
                                                      collected.first().content;
                                                    thread
                                                      .send({
                                                        content: `${questions.q6}`,
                                                      })
                                                      .then(async (msg) => {
                                                        await msg.channel
                                                          .awaitMessages({
                                                            thread: filter,
                                                            time: 60000,
                                                            max: 1,
                                                            errors: ["time"],
                                                          })
                                                          .then((collected) => {
                                                            const msg6 =
                                                              collected.first()
                                                                .content;
                                                            thread
                                                              .send({
                                                                content: `${questions.q7}`,
                                                              })
                                                              .then(
                                                                async (msg) => {
                                                                  await msg.channel
                                                                    .awaitMessages(
                                                                      {
                                                                        thread:
                                                                          filter,
                                                                        time: 60000,
                                                                        max: 1,
                                                                        errors:
                                                                          [
                                                                            "time",
                                                                          ],
                                                                      },
                                                                    )
                                                                    .then(
                                                                      (
                                                                        collected,
                                                                      ) => {
                                                                        const msg7 =
                                                                          collected.first()
                                                                            .content;
                                                                        return thread.send(
                                                                          {
                                                                            content: `Thank you, our <@&${config.staffSun}> will manage your tryout time soon`,
                                                                          },
                                                                        );
                                                                      },
                                                                    );
                                                                },
                                                              )
                                                              .catch(
                                                                async (
                                                                  error,
                                                                ) => {
                                                                  await thread.send(
                                                                    "Time is Over",
                                                                  );
                                                                },
                                                              );
                                                          })
                                                          .catch(
                                                            async (error) => {
                                                              await thread.send(
                                                                "Time is Over",
                                                              );
                                                            },
                                                          );
                                                      })
                                                      .catch(async (error) => {
                                                        await thread.send(
                                                          "Time is Over",
                                                        );
                                                      });
                                                  })
                                                  .catch(async (error) => {
                                                    await thread.send(
                                                      "Time is Over",
                                                    );
                                                  });
                                              })
                                              .catch(async (error) => {
                                                await thread.send(
                                                  "Time is Over",
                                                );
                                              });
                                          })
                                          .catch(async (error) => {
                                            await thread.send("Time is Over");
                                          });
                                      })
                                      .catch(async (error) => {
                                        await thread.send("Time is Over");
                                      });
                                  })
                                  .catch(async (error) => {
                                    await thread.send("Time is Over");
                                  });
                              })
                              .catch(async (error) => {
                                await thread.send("Time is Over");
                              });
                          })
                          .catch(async (error) => {
                            await thread.send("Time is Over");
                          });
                      })
                      .catch(async (error) => {
                        await thread.send("Time is Over");
                      });
                  })
                  .catch(async (error) => {
                    await thread.send("Time is Over");
                  });
              })
              .catch(async (error) => {
                await thread.send("Time is Over");
              });
          }
          break;
      }
    }
  });
};
