import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/quizzes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setQuizzes(response.data);
            } catch (err) {
                setError('Error fetching quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Your Quizzes</h2>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz._id}>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
