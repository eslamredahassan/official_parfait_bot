const mongoose = require("mongoose");
const moment = require("moment");
const config = require("../config");

const databaseConnection = async () => {
  let retryCount = 0;
  const maxRetries = 5;
  const retryInterval = 20 * 1000; // 20 seconds in milliseconds

  const connection = async () => {
    try {
      await mongoose.connect(config.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "ParfaitDatabaseDev",
      });

      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Database`,
        `\x1b[32m CONNECTED`,
      );
    } catch (error) {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Database`,
        `\x1b[323m ERROR: `,
        error.message,
      );

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Retrying connection`,
          `\x1b[32m (Attempt ${retryCount}/${maxRetries})`,
        );
        setTimeout(connection, retryInterval);
      } else {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Max retries reached`,
          `\x1b[32m Unable to connect to the database`,
        );
        process.exit(1); // You can handle this differently based on your application's needs
      }
    }
  };

  await connection();
};

module.exports = databaseConnection;
