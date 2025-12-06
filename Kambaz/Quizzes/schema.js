import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: String,
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"],
    default: "MULTIPLE_CHOICE"
  },
  title: String,
  points: { type: Number, default: 0 },
  question: String,
  choices: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: Boolean,
  possibleAnswers: [String],
  caseSensitive: { type: Boolean, default: false }
});

const quizSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, default: "New Quiz" },
  description: String,
  course: { type: String, ref: "CourseModel" },
  quizType: {
    type: String,
    enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
    default: "GRADED_QUIZ"
  },
  points: { type: Number, default: 0 },
  assignmentGroup: {
    type: String,
    enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
    default: "QUIZZES"
  },
  shuffleAnswers: { type: Boolean, default: true },
  timeLimit: { type: Number, default: 20 },
  multipleAttempts: { type: Boolean, default: false },
  howManyAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
  accessCode: { type: String, default: "" },
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  viewResponses: { type: String, default: "ALWAYS" },
requireRespondusLockDown: { type: Boolean, default: false },
requiredToViewQuizResults: { type: Boolean, default: false },
  dueDate: Date,
  availableDate: Date,
  untilDate: Date,
  published: { type: Boolean, default: false },
  questions: [questionSchema]
}, { collection: "quizzes" });

export default quizSchema;