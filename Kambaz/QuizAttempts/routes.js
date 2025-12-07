import * as dao from "./dao.js";
import * as quizDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const startAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    try {
      const quiz = await quizDao.findQuizById(quizId);
      
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      const maxScore = quiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;
      
      const attemptCount = await dao.countAttempts(quizId, currentUser._id);
      
      if (!quiz.multipleAttempts && attemptCount >= 1) {
        res.status(403).json({ message: "Only one attempt allowed" });
        return;
      }
      
      if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
        res.status(403).json({ message: "All attempts used" });
        return;
      }

      const allAttempts = await dao.findAttemptsForQuiz(quizId, currentUser._id);
      const inProgressAttempt = allAttempts.find(a => !a.submittedAt);
      
      if (inProgressAttempt) {
        console.log(`📌 Returning existing in-progress attempt #${inProgressAttempt.attemptNumber}`);
        res.json(inProgressAttempt);
        return;
      }

      const attempt = {
        quiz: quizId,
        user: currentUser._id,
        course: quiz.course,
        attemptNumber: attemptCount + 1,
        maxScore: maxScore,
        score: 0,
        answers: []
      };

      const newAttempt = await dao.createAttempt(attempt);
      
      console.log(`✅ Created attempt #${attempt.attemptNumber} for user ${currentUser._id} - maxScore: ${maxScore}`);
      
      res.json(newAttempt);
    } catch (error) {
      console.error('❌ Error in startAttempt:', error);
      res.status(500).json({ message: error.message || 'Failed to start quiz' });
    }
  };

  const submitAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;
    
    try {
      const attempt = await dao.findAttemptById(attemptId);
      
      if (!attempt) {
        res.status(404).json({ message: "Attempt not found" });
        return;
      }

      if (attempt.submittedAt) {
        res.status(400).json({ message: "Attempt already submitted" });
        return;
      }

      const quiz = await quizDao.findQuizById(attempt.quiz);
      
      let score = 0;
      const gradedAnswers = answers.map(answer => {
        const question = quiz.questions.find(q => q._id === answer.questionId);
        
        if (!question) {
          return {
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect: false,
            pointsEarned: 0
          };
        }

        let isCorrect = false;
        let pointsEarned = 0;

        if (question.type === "MULTIPLE_CHOICE") {
          const correctChoice = question.choices.find(c => c.isCorrect);
          isCorrect = answer.answer === correctChoice?.text;
          pointsEarned = isCorrect ? question.points : 0;
        } else if (question.type === "TRUE_FALSE") {
          isCorrect = answer.answer === question.correctAnswer;
          pointsEarned = isCorrect ? question.points : 0;
        } else if (question.type === "FILL_BLANK") {
          const answerText = question.caseSensitive 
            ? answer.answer 
            : answer.answer?.toLowerCase();
          isCorrect = question.possibleAnswers.some(possible => {
            const possibleText = question.caseSensitive 
              ? possible 
              : possible.toLowerCase();
            return answerText === possibleText;
          });
          pointsEarned = isCorrect ? question.points : 0;
        } else if (question.type === "MULTIPLE_CHOICE_MULTIPLE_ANSWERS") {
          const correctChoices = question.choices.filter(c => c.isCorrect).map(c => c.text).sort();
          const userAnswers = Array.isArray(answer.answer) ? [...answer.answer].sort() : [];
          
          isCorrect = JSON.stringify(correctChoices) === JSON.stringify(userAnswers);
          
          if (!isCorrect && question.partialCredit) {
            const correctSelected = userAnswers.filter(a => correctChoices.includes(a)).length;
            const incorrectSelected = userAnswers.filter(a => !correctChoices.includes(a)).length;
            const totalCorrect = correctChoices.length;
            
            if (correctSelected > 0 && incorrectSelected === 0) {
              pointsEarned = (correctSelected / totalCorrect) * question.points;
            }
          } else {
            pointsEarned = isCorrect ? question.points : 0;
          }
        } else if (question.type === "FILL_MULTIPLE_BLANKS") {
          const userBlanks = answer.answer || {};
          let correctBlanks = 0;
          let totalBlanks = question.blanks.length;
          
          question.blanks.forEach(blank => {
            const userAnswer = question.caseSensitive 
              ? userBlanks[blank.blankId] 
              : userBlanks[blank.blankId]?.toLowerCase();
            
            const isBlankCorrect = blank.possibleAnswers.some(possible => {
              const possibleText = question.caseSensitive 
                ? possible 
                : possible.toLowerCase();
              return userAnswer === possibleText;
            });
            
            if (isBlankCorrect) correctBlanks++;
          });
          
          isCorrect = correctBlanks === totalBlanks;
          
          if (question.partialCredit) {
            pointsEarned = (correctBlanks / totalBlanks) * question.points;
          } else {
            pointsEarned = isCorrect ? question.points : 0;
          }
        }

        score += pointsEarned;

        return {
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          pointsEarned
        };
      });

      const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);

      await dao.submitAttempt(attemptId, gradedAnswers, score, maxScore);
      
      const updatedAttempt = await dao.findAttemptById(attemptId);
      
      console.log(`✅ Submitted attempt #${updatedAttempt.attemptNumber} - Score: ${score}/${maxScore}`);
      
      res.json(updatedAttempt);
    } catch (error) {
      console.error('Error submitting attempt:', error);
      res.status(500).json({ message: 'Failed to submit attempt' });
    }
  };

  const getAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const attempt = await dao.findAttemptById(attemptId);
    
    if (!attempt) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }
    
    res.json(attempt);
  };

  const getAttemptsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const attempts = await dao.findAttemptsForQuiz(quizId, currentUser._id);
    res.json(attempts);
  };

  const getLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const attempt = await dao.getLatestAttempt(quizId, currentUser._id);
    
    if (!attempt) {
      res.status(404).json({ message: "No attempts found" });
      return;
    }
    
    res.json(attempt);
  };

  app.post("/api/quizzes/:quizId/attempts", startAttempt);
  app.put("/api/attempts/:attemptId/submit", submitAttempt);
  app.get("/api/attempts/:attemptId", getAttempt);
  app.get("/api/quizzes/:quizId/attempts/user", getAttemptsForQuiz);
  app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
}