import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import QuizList from './components/QuizList';
import CreateQuiz from './components/CreateQuiz';
import TakeQuiz from './components/TakeQuiz';
import './App.css';

const App = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); 

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/quizzes');
            setQuizzes(response.data);
        } catch (err) {
            setError('Error fetching quizzes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleQuizSubmission = async (newQuiz) => {
        try {
            await axios.post('http://localhost:5000/api/quizzes', newQuiz);
            fetchQuizzes();
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="App">
            <h1>Quiz Application</h1>
            {location.pathname !== '/create-quiz' && (
                <Link to="/create-quiz">
                    <button>Create Quiz</button>
                </Link>
            )}
            <Routes>
                <Route path="/" element={<QuizList quizzes={quizzes} />} />
                <Route path="/quiz/:id" element={<TakeQuiz />} />
                <Route path="/create-quiz" element={<CreateQuiz onSubmit={handleQuizSubmission} />} />
            </Routes>
        </div>
    );
};

const Main = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default Main;
