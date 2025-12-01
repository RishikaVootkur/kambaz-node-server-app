import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export async function findModulesForCourse(courseId) {
  const course = await model.findById(courseId);
  return course.modules;
}

export async function createModule(courseId, module) {
  const newModule = { ...module, _id: uuidv4() };
  const status = await model.updateOne(
    { _id: courseId },
    { $push: { modules: newModule } }
  );
  return newModule;
}

export async function updateModule(courseId, moduleId, moduleUpdates) {
  const course = await model.findById(courseId);
  const module = course.modules.id(moduleId);
  Object.assign(module, moduleUpdates);
  await course.save();
  return module;
}

export async function deleteModule(courseId, moduleId) {
  const status = await model.updateOne(
    { _id: courseId },
    { $pull: { modules: { _id: moduleId } } }
  );
  return status;
}