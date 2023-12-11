const { codeBlock } = require("@discordjs/builders");
const config = require("../config");
const moment = require("moment");
const express = require("express");
const app = express();
const port = 3000;
//// Application Sun ///

module.exports = async (client, config) => {
  app.get("/", (req, res) => {
    res.send(
      `🟢 Parfait Online in IEgyGamerI server ${moment().format("LTS")}`,
    );
  });
  app.listen(port, () => {
    console.log(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Uptime connection`,
      `\x1b[32m LOADED`,
    );
  });
};
