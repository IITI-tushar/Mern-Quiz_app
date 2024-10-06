const mongoose = require('mongoose');

const answerOptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean},
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    answerOptions: { type: [answerOptionSchema], required: true },
    correctAnswer: { type: String },
    questionType: { type: String, default: 'multiple-choice' },
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    questions: { type: [questionSchema], required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

module.exports = mongoose.model('Quiz', quizSchema);
