import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function findQuizzesForCourse(courseId) {
  return model.find({ course: courseId });
}

export async function findQuizById(quizId) {
  return model.findById(quizId);
}

export async function createQuiz(quiz) {
  const newQuiz = { 
    ...quiz, 
    _id: uuidv4(),
    questions: []
  };
  return model.create(newQuiz);
}

export async function updateQuiz(quizId, quizUpdates) {
  return model.updateOne({ _id: quizId }, { $set: quizUpdates });
}

export async function deleteQuiz(quizId) {
  return model.deleteOne({ _id: quizId });
}

export async function publishQuiz(quizId) {
  return model.updateOne({ _id: quizId }, { $set: { published: true } });
}

export async function unpublishQuiz(quizId) {
  return model.updateOne({ _id: quizId }, { $set: { published: false } });
}

export async function addQuestionToQuiz(quizId, question) {
  const newQuestion = { ...question, _id: uuidv4() };
  const quiz = await model.findById(quizId);
  quiz.questions.push(newQuestion);
  
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  quiz.points = totalPoints;
  
  await quiz.save();
  return newQuestion;
}

export async function updateQuestion(quizId, questionId, questionUpdates) {
  const quiz = await model.findById(quizId);
  const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
  
  if (questionIndex !== -1) {
    quiz.questions[questionIndex] = { ...quiz.questions[questionIndex], ...questionUpdates };
    
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    quiz.points = totalPoints;
    
    await quiz.save();
  }
  return quiz;
}

export async function deleteQuestion(quizId, questionId) {
  const quiz = await model.findById(quizId);
  quiz.questions = quiz.questions.filter(q => q._id !== questionId);
  
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  quiz.points = totalPoints;
  
  await quiz.save();
  return quiz;
}