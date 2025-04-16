import React, { useState } from 'react';
import axios from 'axios';
import './CreateQuiz.css';

const CreateQuiz = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            answerOptions: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            questionType: 'multiple-choice',
            media: { image: '', video: '', audio: '' }
        }
    ]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answerOptions[answerIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions, 
            { 
                questionText: '', 
                answerOptions: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ],
                questionType: 'multiple-choice',
                media: { image: '', video: '', audio: '' }
            }
        ]);
    };

    const handleMediaChange = (index, type, value) => {
        const newQuestions = [...questions];
        newQuestions[index].media[type] = value;
        setQuestions(newQuestions);
    };

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();

        if (!title.trim() || questions.some(q => !q.questionText.trim())) {
            setErrorMessage('Please fill in all fields before submitting.');
            return;
        }
        
        setErrorMessage(''); 
        setIsSubmitting(true); 

        try {
            const quizData = {
                title,
                description,
                questions: questions.map(q => ({
                    ...q,
                    correctAnswer: q.answerOptions.find(opt => opt.isCorrect)?.text || ''
                }))
            };

            await axios.post('http://localhost:5000/api/quizzes', quizData);
            onSubmit(quizData);
            setTitle(''); 
            setDescription('');
            setQuestions([{ questionText: '', answerOptions: [{ text: '', isCorrect: false }] }]);
        } catch (error) {
            console.error('Error creating quiz:', error);
            setErrorMessage('Error creating quiz. Please try again.');
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="container">
            <h2>Create a Quiz</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmitQuiz}>
                <div className="form-group">
                    <label htmlFor="quizTitle">Title</label>
                    <input 
                        id="quizTitle"
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quizDescription">Description</label>
                    <textarea 
                        id="quizDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                        className="textarea-field"
                    />
                </div>

                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-block">
                        <label htmlFor={`question${qIndex}`}>Question {qIndex + 1}</label>
                        <input 
                            id={`question${qIndex}`}
                            type="text" 
                            value={question.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                            required
                            className="input-field"
                        />
                        <div className="form-group">
                            <label htmlFor={`questionType${qIndex}`}>Question Type</label>
                            <select
                                id={`questionType${qIndex}`}
                                value={question.questionType}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                                className="input-field"
                            >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="fill-in-the-blank">Fill in the Blank</option>
                                <option value="matching">Matching</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor={`image${qIndex}`}>Image URL</label>
                            <input
                                id={`image${qIndex}`}
                                type="text"
                                value={question.media.image}
                                onChange={(e) => handleMediaChange(qIndex, 'image', e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={`video${qIndex}`}>Video URL</label>
                            <input
                                id={`video${qIndex}`}
                                type="text"
                                value={question.media.video}
                                onChange={(e) => handleMediaChange(qIndex, 'video', e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={`audio${qIndex}`}>Audio URL</label>
                            <input
                                id={`audio${qIndex}`}
                                type="text"
                                value={question.media.audio}
                                onChange={(e) => handleMediaChange(qIndex, 'audio', e.target.value)}
                                className="input-field"
                            />
                        </div>
                        {question.answerOptions.map((option, aIndex) => (
                            <div key={aIndex} className="answer-option">
                                <label htmlFor={`answer${qIndex}-${aIndex}`}>Answer {aIndex + 1}</label>
                                <input 
                                    id={`answer${qIndex}-${aIndex}`}
                                    type="text" 
                                    value={option.text}
                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, 'text', e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={option.isCorrect}
                                        onChange={(e) => handleAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                                    />
                                    Is Correct
                                </label>
                            </div>
                        ))}
                    </div>
                ))}

                <div>
                    <button type="button" className="add-question-button" onClick={handleAddQuestion}>
                        Add Another Question
                    </button>
                    <button type="submit" className="submit-button" disabled={isSubmitting}> 
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'} 
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
