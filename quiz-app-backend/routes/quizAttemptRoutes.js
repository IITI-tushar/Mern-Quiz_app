const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

router.post('/submit', async (req, res) => {
    const { quizId, answers } = req.body;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;

        quiz.questions.forEach((question, index) => {
            const correctOption = question.answerOptions.find(option => option.isCorrect);

            if (correctOption && answers[index] === correctOption.text) {
                score++;
            }
        });

        res.json({ score, totalQuestions: quiz.questions.length });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
});

module.exports = router;
