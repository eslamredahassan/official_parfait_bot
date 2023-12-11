const { codeBlock } = require("@discordjs/builders");
const config = require("../config");
const moment = require("moment");

module.exports = (client) => {
  process.on("unhandledRejection", (reason, p) => {
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m [antiCrash] ::`,
      `\x1b[35m Unhandled Rejection/Catch`,
    );
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Error:`,
      `\x1b[35m ${reason}`,
      `\x1b[35m ${p}`,
    );
  });
  process.on("uncaughtException", (error, origin) => {
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m [antiCrash] ::`,
      `\x1b[35m Uncaught Exception/Catch`,
    );
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Error:`,
      `\x1b[35m$ ${error.message}`,
      `\x1b[35m ${origin}`,
    );
  });
  process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m [antiCrash] ::`,
      `\x1b[35m Uncaught Exception/Catch (MONITOR)`,
    );
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Error:`,
      `\x1b[35m ${error.message}`,
      `\x1b[35m ${origin}`,
    );
  });
  process.on("multipleResolves", (type, promise, reason) => {
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m [antiCrash] ::`,
      `\x1b[35m Multiple Resolves`,
    );
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Error:`,
      type,
      promise,
      reason,
    );
  });
  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m Anti Crash`,
    `\x1b[32m LOADED`,
  );
};
