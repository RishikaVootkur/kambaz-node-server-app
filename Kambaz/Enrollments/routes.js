import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  const findAllEnrollments = async (req, res) => {
    const enrollments = await dao.findAllEnrollments();
    res.json(enrollments);
  };

  app.get("/api/enrollments", findAllEnrollments);
}