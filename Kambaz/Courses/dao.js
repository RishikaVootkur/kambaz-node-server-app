import { v4 as uuidv4 } from "uuid";
export default function CoursesDao(db) {
  
  const findAllCourses = () => db.courses;
  
  const findCourseById = (courseId) => db.courses.find((c) => c._id === courseId);
  
  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses.push(newCourse);  // ✅ Direct update
    return newCourse;
  };
  
  const updateCourse = (courseId, courseUpdates) => {
    const course = db.courses.find((c) => c._id === courseId);
    if (course) {
      Object.assign(course, courseUpdates);  // ✅ Direct mutation
    }
    return course;
  };
  
  const deleteCourse = (courseId) => {
    db.courses = db.courses.filter((c) => c._id !== courseId);  // ✅ Direct update
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
  };
  
  const findCoursesForEnrolledUser = (userId) => {
    const enrolledCourseIds = db.enrollments
      .filter((e) => e.user === userId)
      .map((e) => e.course);
    return db.courses.filter((c) => enrolledCourseIds.includes(c._id));
  };
  
  return {
    findAllCourses,
    findCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    findCoursesForEnrolledUser,
  };
}