import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TakeQuiz.css';

const TakeQuiz = () => {
    const { id } = useParams(); 
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
                setQuiz(response.data);
                setAnswers(Array(response.data.questions.length).fill(''));
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/quiz-attempts/submit', {
                quizId: quiz._id,
                answers,
            });
            setScore(response.data.score);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (!quiz) {
        return <div>Loading quiz...</div>;
    }

    return (
        <div className="quiz-container">
            <h2>{quiz.title}</h2>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((question, index) => (
                    <div key={index}>
                        <div className="question">{question.questionText}</div> 
                        {question.answerOptions.map((option, aIndex) => (
                            <div className="answer-option" key={aIndex}>
                            <label>
                                <input
                                    type="radio"
                                    name={`question${index}`}
                                    value={option.text}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    required
                                />
                                {option.text}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Submit Quiz</button>
            </form>
            {score !== null && <h3>Your Score: {score} out of {quiz.questions.length}</h3>}
        </div>
    );
};
export default TakeQuiz;
