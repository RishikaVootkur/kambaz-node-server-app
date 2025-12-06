import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };

  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = {
      ...req.body,
      course: courseId,
    };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.publishQuiz(quizId);
    res.json(status);
  };

  const unpublishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.unpublishQuiz(quizId);
    res.json(status);
  };

  const addQuestionToQuiz = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    const newQuestion = await dao.addQuestionToQuiz(quizId, question);
    res.json(newQuestion);
  };

  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    const quiz = await dao.updateQuestion(quizId, questionId, questionUpdates);
    res.json(quiz);
  };

  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const quiz = await dao.deleteQuestion(quizId, questionId);
    res.json(quiz);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.post("/api/quizzes/:quizId/publish", publishQuiz);
  app.post("/api/quizzes/:quizId/unpublish", unpublishQuiz);
  app.post("/api/quizzes/:quizId/questions", addQuestionToQuiz);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}