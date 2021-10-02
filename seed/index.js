const db = require("../server/db");
const moment = require("moment")
const { Student } = require("../server/db/models");

async function seed() {
  await db.sync({ force: true });
  console.log("Database has been synced");

  const studentOne = await Student.create({
    firstName: "Johnny",
    lastName: "Vazquez",
    dateOfBirth: moment(new Date).format("YYYY-MM-DD") ,
    address: "28 S Maple",
    enrollmentStatus: "active",
    enrollmentDate: moment(new Date).format("YYYY-MM-DD"),
  });
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

if (module === require.main) {
  runSeed();
}
