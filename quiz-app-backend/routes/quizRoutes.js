const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

router.post('/', async (req, res) => {
    const { title, description, questions } = req.body;

    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
        return res.status(400).json({ message: 'Quiz with this title already exists.' });
    }

    try {
        const newQuiz = new Quiz({ title, description, questions });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quiz', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id); 
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' }); 
        }
        res.json(quiz); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); 
    }
});

module.exports = router;
