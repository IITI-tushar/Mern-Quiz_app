import React from 'react';
import { Link } from 'react-router-dom';
import './quizList.css';

const QuizList = ({ quizzes }) => {
    const uniqueQuizzes = Array.from(new Set(quizzes.map(quiz => quiz._id)))
        .map(id => quizzes.find(quiz => quiz._id === id));

    return (
        <div>
            <h2>Available Quizzes</h2>
            <ul>
                {uniqueQuizzes.map((quiz) => (
                    <li key={quiz._id}>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <Link to={`/quiz/${quiz._id}`}>Take this quiz</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizList;
