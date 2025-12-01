import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findAllCourses() {
  return model.find();
}

export const findCourseById = (courseId) => model.findById(courseId);

export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}