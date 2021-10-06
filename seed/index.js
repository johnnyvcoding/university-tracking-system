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
const Exam = require("../server/db/models/exam");
const StudentExam = require("../server/db/models/student-exam");

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
    dateOfBirth: moment(new Date()).format("YYYY-MM-DD"),
  });

  const userTwo = await User.create({
    firstName: "Josepeh",
    lastName: "Gates",
    isAdmin: true,

    email: "jgates@mail.com",
    password: "123",
    dateOfBirth: moment(new Date()).format("YYYY-MM-DD"),
  });

  const professorOne = await Professor.create({
    firstName: "Chris",
    lastName: "Mallan",
    address: "33 Butrick St",
    hireDate: moment(new Date()).format("YYYY-MM-DD"),
    dateOfBirth: moment(new Date()).format("YYYY-MM-DD"),
    email: "cmallan@mail.com",
  });


  const professorTwo = await Professor.create({
    firstName: "Katherine",
    lastName: "Butera",
    address: "1706 Greenwod Ave",
    hireDate: moment(new Date()).format("YYYY-MM-DD"),
    dateOfBirth: moment(new Date()).format("YYYY-MM-DD"),
    email: "kbutera@mail.com",
  });


  const courseOne = await Course.create({
    name: "Math 120",
    courseCode: "192-AZU",
    description: "Algebra 2",
    startDate: moment(new Date()).format("YYYY-MM-DD"),
    endDate: "2022-10-30"

  });

  const courseTwo = await Course.create({
    name: "Ancient Civs",
    courseCode: "192-HSU",
    description: "Learn about ancient civilizations",
    startDate: moment(new Date()).format("YYYY-MM-DD"),
    endDate: "2022-11-30"

  });

  await professorOne.addCourse(courseOne);
  await professorTwo.addCourse(courseTwo)

  await studentOne.addCourse(courseOne);
  await studentOne.addCourse(courseTwo)

  function generateKey() {
    //creates a base 36 string character
    // letters can range from a-z
    // nummbers 0-9
    return [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join("");
  }

  let keyReturned = generateKey();

  console.log("this is the key of user one: ", keyReturned);
  const keyOne = await Apikey.create({
    key: keyReturned,
  });
  const keyTwo = await Apikey.create({
    key: "hello-world",
  });

  await userOne.setApikey(keyOne);
  await userTwo.setApikey(keyTwo);

  const testOne = await Exam.create({
    name: "Factoring",
    points: 50,
  });

  await courseOne.addExam(testOne);
  //student one got 15 points on the test
  await studentOne.addExam(testOne, {
    through: {
      studentPoints: 15,
      // prevents weird decimals like .92100110293222^...
      grade: parseFloat(15 / testOne.points).toPrecision(12),
      completionDate: moment(new Date()).format("YYYY-MM-DD"),
      courseId: courseOne.courseId
    },
  });

  // should return an array of exam grades for the given course
  const studentOneExams = await StudentExam.findAll({
    where: {
      studentId: studentOne.studentId,
    },
  });

  let result = calculateGrades(studentOneExams);
  console.log("res back", result);
}

function calculateGrades(gradesArray) {
  let grade = 0;
  for (let i = 0; i < gradesArray.length; i++) {
    grade = grade + parseFloat(gradesArray[i].grade);
  }

  return parseFloat(grade / gradesArray.length);
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
