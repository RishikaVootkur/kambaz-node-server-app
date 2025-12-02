import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model
    .find({ 
      course: courseId,
      $or: [
        { status: "ENROLLED" },           
        { status: { $exists: false } }    
      ]
    })
    .populate("user");
  
  return enrollments
    .map((enrollment) => enrollment.user)
    .filter((user) => user !== null); 
}

export function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`,
    status: "ENROLLED",  
  });
}

export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}

export function findAllEnrollments() {
  return model.find();
}

export function unenrollAllUsersFromCourse(courseId) {
  return model.deleteMany({ course: courseId });
}