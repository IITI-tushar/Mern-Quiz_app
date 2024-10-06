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
            ]
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
                ]
            }
        ]);
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
