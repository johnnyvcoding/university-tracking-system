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

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "<scecret_key>",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

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

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
