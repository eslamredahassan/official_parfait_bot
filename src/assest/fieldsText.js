const emojis = require("../assest/emojis");
const moment = require("moment");
require("moment-duration-format");
const members = require("../assest/members");

module.exports = {
  ///---| Main UI Fields Text |---///
  rank: `${emojis.diamond} Rank Diamond+${emojis.required}`,

  level: `${emojis.level} Level 90+${emojis.required}`,

  cooldownNote: `${emojis.threadMarkmid} We apply a cooldown **30 days** for failed application for first time\n${emojis.threadMarkmid} The cooldown period will be doubled per rejected application\n${emojis.threadMark} You can apply again after cooldown duration\n`,

  warning: `${emojis.threadMarkmid} Complete your application inside your thread\n${emojis.threadMarkmid} After completing your application, stay alert in your thread\n${emojis.threadMarkmid} Reviewing the application may take a long time\n${emojis.threadMarkmid} Make sure your DM is opened, we may message you\n${emojis.threadMark} Incompeleted application will be rejected`,

  importantNote: `${emojis.threadMark} Required rank isn't important in **the first week of each season**⠀`,
  //--------------------------------------//,

  ///---| DM Messages |---///
  clanCode: `${emojis.threadMark} ||**v7q0itgratob**||`,

  dmWarning: `${emojis.threadMarkmid} Leaving in-game clan means you left SUN \n${emojis.threadMark} Leaving SUN server means you left SUN`,
  //--------------------------------------//,

  //---| About Parfait UI |---///
  programed: `${emojis.threadMark} ${members.egy}`,

  build: `${emojis.threadMark} \`\`^13.7.0\`\``,

  version: `${emojis.threadMark} \`\`^4.6.2\`\``,

  contact: `${emojis.threadMark} Contact with ${members.egy} for all details`,
  //--------------------------------------//,

  //---| Setup Panel UI |---///
  openedMessage: `${emojis.threadMark} This mode allows users to apply for recruitment`,

  closedMessage: `${emojis.threadMark} This mode closes the recruitment and not allows users to apply`,

  devMessage: `${emojis.threadMarkmid} This is a maintenance mode, this mode only for the developers\n${emojis.threadMark} Please don't use it if you are not a developer`,

  noteMessage: `${emojis.threadMarkmid} There's a button for switch between open and close modes\n${emojis.threadMark} You don't need to use the command to switch between modes`,

  noDevNote: `${emojis.threadMark} No Developer Note`,

  //--------------------------------------//,

  //---| Answer yes UI |---///
  tipOne: `- Choose your language from <#884117952012615730>\n - Click on **Become a Sun Legend** and fill the application\n - Fill the application in english`,

  tipTwo: `- Incorrect or fake data or does not meet the requirements will be **rejected**`,
  //--------------------------------------//,

  //---| FAQ Menu Fields |---///
  Notice: `${emojis.threadMarkmid} The FAQ menu will be updated from time to time\n${emojis.threadMark} depending on members' questions`,
  noq: `${emojis.threadMark}` + " ``26 Questions``",
  lastUpdate: `${emojis.threadMark} <t:1693612080:D>`,

  howToApply: `- You can apply by pressing **Sun Application**.\n - Read all requirements.\n - Press **I've Read All Requirements**.\n - Start to fill out your application.\n - Move to your thread to complete the last part of the application.`,
  age: `- The minimum age is 16.`,
  secondPart: `- You have 3 days maximum to complete your application.\n - After 3 days, your application will be rejected and you will be in a cooldown period for 30 days or more.`,
  applyInCooldown: `- No you can't, you need to wait until your cooldown period ends and it will be started after your application rejection.`,
  withoutApply: `- No you can't, you need to apply first`,
  multipleAcconts: `- No you can't, since the in-game clan is limited`,
  joinAnotherClan: `- It's up to you, you will only be charged on your main account (account that you used to apply to Sun)`,
  inCooldownPeriod: `- You'll be in the cooldown period`,
  inPeriodTrial: `- You'll be in the trial period`,
  periodTrial: `- The trial period is the last test period\n - You need to prove yourself as a Sun member`,
  doInPeriod: `- Join the other Sun members and play together\n - Be active on the Discord server\n - Join Sun training\n - Join the tournaments and competitions like Sun Battlefield`,
  finishPeriod: `- If you did well in this period, you'll get promoted to Team SUN as an official member Team Sun\n - If you didn't the staff will decide if you'll continue in the trial period with some hint or apologies to you
`,
  ifGetRejected: `- For first rejection you'll be in cooldown for 30 days\n - For every rejection your cooldown Period will double or more`,
  canApplyInCooldown: `- No you can't, You need to wait until your cooldown period ends and it will be started after your application rejection`,
  askRejection: `- Yes you can ask the staff member who did your tryout`,
  theTryout: `- Staff members will invite you to a custom match to test and see your skills.`,
  whyTryout: `- The tryout is a normal process that allows us to decide if we can accept you or not.`,
  inviteFriend: `- It's up to the staff to decide.`,
  tryoutTime: `- Usually, it takes from 30 to 45 minutes after setting the day.`,
  sendVideo: `- Yes you can, but this can be used to reduce the tryout duration only.`,
  recordTryout: `- It's up to you, But it is not recommended if it will be the reason for reducing your performance.`,
  applyWhileClosed: `- No you can't, you've to wait until it open again.`,
  whyClose: `- This is happens because of three cases.\n - 1st Case is Receiving many applications\n - 2nd Case is Reached the number of players we need\n - 3rd Case is The staff is busy with other tasks`,
  happensToInfo: `- Your information is stored in a room that only the server Owner(Clan leader) and staff members can reach.\n - Only your smash code will be shared in a special room for Sun members.`,
  chooseStaff: `- No you can't.`,
  feedbackAppProcess: `- Yes you can, in your tryout thread or dm staff member.`,
  feedbackParfait: `- You can send it in your tryout thread\n - Or dm ${members.egy} directly.`,
  //--------------------------------------//,

  //---| About Menu Fields |---///
  aboutSun: `**SUN™&Co Smash Legends the Smash Legends community**,\nCreated in <t:1630858460:F>\nWe always strive to be the best and win more tournaments also, we organize tournaments for smash legends`,
  hallOfFame: `### Tournaments we achieved \n- CCL Tournaments\n - [**2nd** Season #1](https://discord.com/channels/986899741965185054/1002652439733874708/1003994107447877682) ${emojis.whiteDot} <t:1644271200:D>\n - [**3rd** Season #4](https://discord.com/channels/884109207052365924/884196552829202432/1036643661313744976) ${emojis.whiteDot} <t:1667167200:D>\n - [**1st** Season #7](https://discord.com/channels/884109207052365924/884196552829202432/1094250818762444832) ${emojis.whiteDot} <t:1680818400:D>\n### Other achievements\n- A visit of 5minlab studios in Seoul including playing with the big boss and peting the real Master Cat [𝗩isit-at-5minlab](https://discord.gg/XvT5uhfsFw).\n- <@!921695937259245579> invited in [Smash Legends](https://discord.gg/smashlegends) official server to make the search of teammates easier.\n- Organize big tournaments including [SUN&CO](https://discord.gg/ymGenWPwTv) Clan Wars with 300€ of prizepool and 5minlab rewards.\n- <@612963985964269568> become a moderator in [Smash Legends](https://discord.gg/smashlegends) official discord server.`,
  staffMembers: `- ${members.kd} - <@&966500457365274726>\n - Joined in: <t:1670018400:D>\n- ${members.egy} - <@&968409999523053630>\n - Joined in: <t:1672432980:D>\n- ${members.sasso} - <@&923728982812262490>\n - Joined in: <t:1659564000:D>\n- ${members.yoshi} - <@&1074406541907726447>\n - Joined in: <t:1642543200:D>\n- ${members.ofak} - <@&1132362187869008013>\n - Joined in: <t:1671746400:D>`,
  leaders: `- ${members.candy} **The Owner**\n- ${members.satanas} **Smash Legends Clan Leader**\n- ${members.bigby} <@&966500457365274726>`,
  partners: `**[[NØT] Notorious](https://discord.gg/3mb9h5qVN6)**`,
  //--------------------------------------//,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Fields File`,
  `\x1b[32m LOADED`,
);
