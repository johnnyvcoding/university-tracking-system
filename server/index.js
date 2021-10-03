const express = require("express");
const passport = require("passport");

const morgan = require("morgan");
const compression = require("compression");

const app = express();

const db = require("./db/index");

const session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
  );
};

async function bootApp() {
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
