import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: String,
  answer: mongoose.Schema.Types.Mixed, 
  isCorrect: Boolean,
  pointsEarned: Number
});

const quizAttemptSchema = new mongoose.Schema({
  _id: String,
  quiz: { type: String, ref: "QuizModel" },
  user: { type: String, ref: "UserModel" },
  course: { type: String, ref: "CourseModel" },
  attemptNumber: { type: Number, default: 1 },
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  timeSpent: Number 
}, { collection: "quizAttempts" });

export default quizAttemptSchema;