const emojis = require("../assest/emojis");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  ///---| Cooldown responses |---///
  wait: `Wait a little bit before asking me to do this again ${emojis.annoyed}`,
  lazy: `I'm lazy now ask me later ${emojis.dead}`,
  know: `Do I know you before? ${emojis.think}`,
  busy: `I'm busy now come back later ${emojis.tea}`,
  //--------------------------------------//,

  ///---| Stop responses |---///
  oh: `Seems the door is closed, do you have the key? ${emojis.think}`,
  ops: `Oops! The recruitment is closed now come back later ${emojis.ops}`,
  sad: `You can't apply now because the recruitment is closed ${emojis.dead}`,
  angry: `What do you see above, hieroglyphs? The recruitment is closed ${emojis.annoyed}`,
  //--------------------------------------//,

  ///---| Ping command responses |---///
  peekapoo: `peekapoo`,
  live: `Hi I'm Alive`,
  hello: `Hello There`,
  //--------------------------------------//,

  ///---| Answer No responses |---///
  wdyt: `${emojis.threadMark} What do you think, am I gonna let you apply without reading the requirements?`,

  really: `${emojis.threadMark} Really? Go back and read the requirements`,

  itycr: `${emojis.threadMark} I think you can read, Read the requirements`,

  ycawr: `${emojis.threadMark} You can apply without reading the requirements But on my body`,
  //--------------------------------------//,

  ///---| Ping command responses |---///
  wdyw: `What do you want?`,
  dnd: `don't disturb me`,
  lost: `Are you lost baby girl?`,
  hi: `Hi Dude, I can't talk now`,
  ntfc: `I'm working now, no time for chat`,
  //--------------------------------------//,
};
console.log(
  `\x1b[0m`,
  `\x1b[33m 〢`,
  `\x1b[33m ${moment(Date.now()).format("LT")}`,
  `\x1b[31m Responses File`,
  `\x1b[32m LOADED`,
);
