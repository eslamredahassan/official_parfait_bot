const emojis = require("../assest/emojis");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  ///---| Main UI Banners |---///
  gray: `#2b2d31`,
  pink: `DARK_VIVID_PINK`,
  //--------------------------------------//,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Colors File`,
  `\x1b[32m LOADED`,
);
