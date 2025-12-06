import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function createAttempt(attempt) {
  const newAttempt = { 
    ...attempt, 
    _id: uuidv4(),
    startedAt: new Date()
  };
  return model.create(newAttempt);
}

export async function findAttemptById(attemptId) {
  return model.findById(attemptId);
}

export async function findAttemptsForQuiz(quizId, userId) {
  return model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
}

export async function getLatestAttempt(quizId, userId) {
  return model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
}

export async function countAttempts(quizId, userId) {
  return model.countDocuments({ quiz: quizId, user: userId });
}

export async function submitAttempt(attemptId, answers, score, maxScore) {
  return model.updateOne(
    { _id: attemptId },
    { 
      $set: { 
        answers, 
        score, 
        maxScore,
        submittedAt: new Date() 
      } 
    }
  );
}

export async function updateAttemptAnswers(attemptId, answers) {
  return model.updateOne(
    { _id: attemptId },
    { $set: { answers } }
  );
}