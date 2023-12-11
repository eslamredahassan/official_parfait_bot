const moment = require("moment");
require("moment-duration-format");

const emojis = require("../assest/emojis");

module.exports = {
  permsError: `${emojis.threadMark} You don't have the required permissions or role to do this action`,
  ageError: `${emojis.whiteDot} Your age must be a number, please resend the application`,
  recruitmentsClosed: `${emojis.pinkDot} Recruitments closed now, come back later`,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Errors File`,
  `\x1b[32m LOADED`,
);
