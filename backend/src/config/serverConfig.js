const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const serverConfigFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: serverConfigFile });
} else {
  dotenv.config();
}

module.exports = {
  PORT: process.env.PORT,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  QUEUE_NAME: process.env.QUEUE_NAME,
};
