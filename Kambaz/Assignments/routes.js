import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignmentData = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = await dao.createAssignment(assignmentData);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    await dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    await dao.updateAssignment(assignmentId, assignmentUpdates);
    res.sendStatus(200);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}