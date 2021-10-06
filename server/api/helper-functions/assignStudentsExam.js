const { Course, StudentExam, Student } = require("../../db/models");

// this function will return an array
// of students ids
// such as [1,3,21,10]
async function getStudentsInCourse(courseId) {
  try {
    let course = await Course.findOne({
      where: {
        courseId: courseId,
      },
      include: Student
    });

    return course.Students;
  } catch (error) {
    console.log(error);
  }
}
// this function will return an array
// of students ids, courseId, examId
/* 
    such as [
        {
            studentId: 1,
            courseId: 10,
            examId: 3
        }
    ]
*/
function returnStudentIds(studentsArray, courseId, examId) {
  return studentsArray.map((student) => {
      return {
          studentId: student.studentId,
          courseId: courseId,
          examId: examId
      }
  });
}

async function assignStudentsExam(courseId, exam) {
  try {
    let studentsArray = await getStudentsInCourse(courseId);
    let studentsIds = returnStudentIds(studentsArray, courseId, exam.examId);

    return await StudentExam.bulkCreate(studentsIds);

  } catch (error) {
    console.log(error);
  }
}

module.exports = assignStudentsExam;
