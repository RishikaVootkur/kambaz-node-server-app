import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

export async function createModule(module) {
  console.log("=== DAO createModule ===");
  console.log("Received module:", module);
  
  const newModule = { ...module, _id: uuidv4() };
  console.log("Creating module:", newModule);
  
  const created = await model.create(newModule);
  console.log("MongoDB created:", created);
  
  return created;
}

export async function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}

export async function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}