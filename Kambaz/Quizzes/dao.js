import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// FIXED: Find all quizzes for a course, sorted by availableDate (earliest first)
export async function findQuizzesForCourse(courseId) {
  return model
    .find({ course: courseId })
    .sort({ availableDate: 1 });  // ← Sort by availableDate ascending (1 = earliest first, -1 = latest first)
}

// Find a single quiz by its ID
export async function findQuizById(quizId) {
  return model.findById(quizId);
}

// Create a new quiz
export async function createQuiz(quiz) {
  const newQuiz = { 
    ...quiz, 
    _id: uuidv4(),
    questions: []
  };
  return model.create(newQuiz);
}

// Update a quiz
export async function updateQuiz(quizId, quizUpdates) {
  return model.updateOne({ _id: quizId }, { $set: quizUpdates });
}

// Delete a quiz
export async function deleteQuiz(quizId) {
  return model.deleteOne({ _id: quizId });
}

// Publish a quiz (set published: true)
export async function publishQuiz(quizId) {
  return model.updateOne({ _id: quizId }, { $set: { published: true } });
}

// Unpublish a quiz (set published: false)
export async function unpublishQuiz(quizId) {
  return model.updateOne({ _id: quizId }, { $set: { published: false } });
}

// Add a question to a quiz and recalculate total points
export async function addQuestionToQuiz(quizId, question) {
  const newQuestion = { ...question, _id: uuidv4() };
  const quiz = await model.findById(quizId);
  quiz.questions.push(newQuestion);
  
  // Recalculate total points for the quiz
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  quiz.points = totalPoints;
  
  await quiz.save();
  return newQuestion;
}

// Update a question in a quiz and recalculate total points
export async function updateQuestion(quizId, questionId, questionUpdates) {
  const quiz = await model.findById(quizId);
  const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
  
  if (questionIndex !== -1) {
    quiz.questions[questionIndex] = { ...quiz.questions[questionIndex], ...questionUpdates };
    
    // Recalculate total points for the quiz
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    quiz.points = totalPoints;
    
    await quiz.save();
  }
  return quiz;
}

// Delete a question from a quiz and recalculate total points
export async function deleteQuestion(quizId, questionId) {
  const quiz = await model.findById(quizId);
  quiz.questions = quiz.questions.filter(q => q._id !== questionId);
  
  // Recalculate total points for the quiz
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  quiz.points = totalPoints;
  
  await quiz.save();
  return quiz;
}