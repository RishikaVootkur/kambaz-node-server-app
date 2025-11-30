import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  
  const enrollUserInCourse = (userId, courseId) => {
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments.push(newEnrollment); 
    return newEnrollment;
  };
  
  const unenrollUserFromCourse = (userId, courseId) => {
    db.enrollments = db.enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    ); 
  };
  
  const findCoursesForEnrolledUser = (userId) => {
    const enrolledCourseIds = db.enrollments
      .filter((e) => e.user === userId)
      .map((e) => e.course);
    return db.courses.filter((c) => enrolledCourseIds.includes(c._id));
  };

  const findAllEnrollments = () => {
    return db.enrollments;
  };
  
  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findCoursesForEnrolledUser,
    findAllEnrollments, 
  };
}