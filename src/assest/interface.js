const moment = require("moment");
require("moment-duration-format");

const emojis = require("../assest/emojis");
const members = require("../assest/members");

module.exports = {
  RequirementsMessage: `${emojis.threadMarkmid} No hate speech or discriminatory language towards anyone\n${emojis.threadMarkmid} Keep conversations civil and avoid personal attacks\n${emojis.threadMarkmid} Do not share explicit or inappropriate content\n${emojis.threadMarkmid} No offensive discord nickname\n${emojis.threadMarkmid} No offensive in-game nickname\n${emojis.threadMarkmid} Follow the moderators and staff instructions and decisions\n${emojis.threadMarkmid} Do not spam or promote any external products or services\n${emojis.threadMarkmid} **European players** only are allowed to apply\n${emojis.threadMarkmid} If you spam the application will get you permanently banned\n${emojis.threadMarkmid} Absence of more than \`\`7 days\`\` without excuse is not allowed\n${emojis.threadMark} All applications aren't match our requirements will be rejected ⠀`,

  MainUImessage: `### ${emojis.info} **Do you want to join Sun Legends clan ?**\n${emojis.threadMarkmid} Click on **Sun Application** button\n${emojis.threadMarkmid} Then read all requirements\n${emojis.threadMark} Then continue to apply\n### ${emojis.warn} **To join you must be**`,

  maintenanceMessage: `### ${emojis.maintenance} **Maintenance**\n${emojis.threadMark} **Parfait under maintenance now**\n### ${emojis.info} **What does this mean?**\n${emojis.threadMarkmid} Parfait will be unusable during this period\n${emojis.threadMarkmid} All features are disabled during this period\n${emojis.threadMarkmid} Current applications will be paused\n${emojis.threadMark} Maintenance takes \`\`1 hour\`\` or more sometimes`,

  aboutMessage: `### ${emojis.info} Parfait is a discord application manager bot\n${emojis.threadMarkmid} Coded with more than \`\`6500\`\` lines of code\n${emojis.threadMarkmid} More than \`\`175\`\` emoji and icon\n${emojis.threadMarkmid} More than \`\`25\`\` banners and images\n${emojis.threadMarkmid} To facilitate the recruitment process\n${emojis.threadMarkmid} It's named by ${members.candy}\n${emojis.threadMark} And it's being developed regularly`,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Interface File`,
  `\x1b[32m LOADED`,
);
