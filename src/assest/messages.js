const emojis = require("../assest/emojis");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  ///---| Main Action Messages |---///
  acceptMessage: `Congratulations and welcome in the familly\nYou are now "in trial" period to join SUN\n\nUse Clan code below to join the clan in game`,

  promoteMessage: `Congratulations you are now officially in **TeamSun**\nBe proud and do your best`,

  threadMessage: ` We need to complete some information in your application\n${emojis.threadMarkmid} Press continue to start see the questions\n${emojis.threadMarkmid} Answer each question separately after using the reply button\n${emojis.threadMarkmid} Skipping the questions or spamming the button causes your application to be rejected\n${emojis.threadMark} Your answers must be in **English**`,

  Banned: "You have been banned from recruitment system",

  apologize: "We apologize to you, you're not being in **Sun Clan** anymore",

  reject:
    "You can't join SUN, at least for now. Improve your gameplay and you will be able to try again (1 application max/month)",

  appSentmessage: `for your love towards **SUN!**\n- Now you need to complete some information in your application\n `,
  //--------------------------------------//,

  ///---| Select menu messages |---///
  faqMenuMainMessage: `\n${emojis.threadMark} Select the questions category to see answer for your questions`,
  //--------------------------------------//,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Messages File`,
  `\x1b[32m LOADED`,
);
