const express = require('express');
const QuizAttempt = require('../models/quizAttempt');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT'); // JWT authentication middleware

// Route to fetch quiz performance statistics for a user
router.get('/performance', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const quizAttempts = await QuizAttempt.find({ user: userId }).populate('quiz');

        const performanceStats = quizAttempts.map(attempt => ({
            quizTitle: attempt.quiz.title,
            score: attempt.score,
            timeTaken: attempt.timeTaken,
            attemptDate: attempt.attemptDate
        }));

        res.json(performanceStats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching performance statistics', error: error.message });
    }
});

// Route to fetch detailed reports on quiz attempts
router.get('/reports', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const quizAttempts = await QuizAttempt.find({ user: userId }).populate('quiz');

        const detailedReports = quizAttempts.map(attempt => ({
            quizTitle: attempt.quiz.title,
            score: attempt.score,
            timeTaken: attempt.timeTaken,
            attemptDate: attempt.attemptDate,
            questions: attempt.quiz.questions
        }));

        res.json(detailedReports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching detailed reports', error: error.message });
    }
});

// Route to fetch quiz history and performance trends over time
router.get('/history', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const quizAttempts = await QuizAttempt.find({ user: userId }).populate('quiz');

        const history = quizAttempts.map(attempt => ({
            quizTitle: attempt.quiz.title,
            score: attempt.score,
            timeTaken: attempt.timeTaken,
            attemptDate: attempt.attemptDate
        }));

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quiz history', error: error.message });
    }
});

module.exports = router;
