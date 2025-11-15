import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  
  const findModulesForCourse = (courseId) => {
    return db.modules.filter((m) => m.course === courseId);
  };
  
  const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4() };
    db.modules.push(newModule);
    return newModule;
  };
  
  const updateModule = (moduleId, moduleUpdates) => {
    const module = db.modules.find((m) => m._id === moduleId);
    if (module) {
      Object.assign(module, moduleUpdates);
    }
    return module;
  };
  
  const deleteModule = (moduleId) => {
    db.modules = db.modules.filter((m) => m._id !== moduleId);
  };
  
  return {
    findModulesForCourse,
    createModule,
    updateModule,
    deleteModule,
  };
}