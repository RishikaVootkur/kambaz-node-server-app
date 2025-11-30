import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    user: { type: String, ref: "UserModel" },
  },
  { collection: "enrollments" }
);

export default enrollmentSchema;