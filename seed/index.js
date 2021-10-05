const db = require("../server/db");
const moment = require("moment");
const {
  Student,
  User,
  Course,
  StudentCourse,
  Professor,
  Apikey,
} = require("../server/db/models");

async function seed() {
  await db.sync({ force: true });
  console.log("Database has been synced");

  const studentOne = await Student.create({
    firstName: "Johnny",
    lastName: "Vazquez",
    dateOfBirth: moment(new Date()).format("YYYY-MM-DD"),
    address: "28 S Maple",
    enrollmentStatus: "active",
    enrollmentDate: moment(new Date()).format("YYYY-MM-DD"),
  });

  const userOne = await User.create({
    firstName: "John",
    lastName: "Doe",
    isAdmin: true,
    email: "jdoe@mail.com",
    password: "123",
  });

  const professorOne = await Professor.create({
    firstName: "Chris",
    lastName: "Mallan",
    address: "33 Butrick St",
  });

  const courseOne = await Course.create({
    name: "Math 120",
    description: "Algebra 2",
  });

  await professorOne.addCourse(courseOne);

  await studentOne.addCourse(courseOne);

  function generateKey() {
    //creates a base 36 string character
    // letters can range from a-z
    // nummbers 0-9
    return [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join("");
  }

  let keyReturned = generateKey()
  console.log("this is the key: ", keyReturned)
  const keyOne = await Apikey.create({
    key: keyReturned
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
