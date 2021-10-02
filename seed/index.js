const db = require("../server/db");

const { Student } = require("../server/db/models");

async function seed() {
  await db.sync({ force: true });
  console.log("Database has been synced");
}

async function runSeed() {
  console.log("Currently seeding the file");

  try {
    await seed();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    console.log("CLOSING DB CONNECTION");
    await db.close();
    console.log("DB CONNECTION HAS CLOSED");
  }
}
