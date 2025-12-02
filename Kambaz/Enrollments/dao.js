import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// Find all courses a user is enrolled in
export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

// Find all users enrolled in a course
// Returns users where status is "ENROLLED" OR status is missing (defaults to ENROLLED)
export async function findUsersForCourse(courseId) {
  // Find enrollments for this course where status is ENROLLED or undefined/missing
  const enrollments = await model
    .find({ 
      course: courseId,
      $or: [
        { status: "ENROLLED" },           // Explicitly ENROLLED
        { status: { $exists: false } }    // OR status field doesn't exist (old data)
      ]
    })
    .populate("user");
  
  // Map to extract user objects and filter out any null users
  return enrollments
    .map((enrollment) => enrollment.user)
    .filter((user) => user !== null);  // Remove null users
}

// Enroll a user in a course - creates new enrollment with ENROLLED status
export function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`,
    status: "ENROLLED",  // New enrollments will have status
  });
}

// Unenroll a user from a course
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}

// Find all enrollments
export function findAllEnrollments() {
  return model.find();
}

// Remove all enrollments for a course
export function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}