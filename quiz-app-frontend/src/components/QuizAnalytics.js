import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizAnalytics = () => {
    const [performanceStats, setPerformanceStats] = useState([]);
    const [detailedReports, setDetailedReports] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformanceStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/quiz-analytics/performance', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPerformanceStats(response.data);
            } catch (err) {
                setError('Error fetching performance statistics');
            } finally {
                setLoading(false);
            }
        };

        const fetchDetailedReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/quiz-analytics/reports', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDetailedReports(response.data);
            } catch (err) {
                setError('Error fetching detailed reports');
            } finally {
                setLoading(false);
            }
        };

        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/quiz-analytics/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(response.data);
            } catch (err) {
                setError('Error fetching quiz history');
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceStats();
        fetchDetailedReports();
        fetchHistory();
    }, []);

    if (loading) {
        return <div>Loading analytics...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Quiz Performance Statistics</h2>
            <ul>
                {performanceStats.map((stat, index) => (
                    <li key={index}>
                        <h3>{stat.quizTitle}</h3>
                        <p>Score: {stat.score}</p>
                        <p>Time Taken: {stat.timeTaken} seconds</p>
                        <p>Attempt Date: {new Date(stat.attemptDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>

            <h2>Detailed Reports</h2>
            <ul>
                {detailedReports.map((report, index) => (
                    <li key={index}>
                        <h3>{report.quizTitle}</h3>
                        <p>Score: {report.score}</p>
                        <p>Time Taken: {report.timeTaken} seconds</p>
                        <p>Attempt Date: {new Date(report.attemptDate).toLocaleDateString()}</p>
                        <h4>Questions:</h4>
                        <ul>
                            {report.questions.map((question, qIndex) => (
                                <li key={qIndex}>
                                    <p>{question.questionText}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <h2>Quiz History</h2>
            <ul>
                {history.map((attempt, index) => (
                    <li key={index}>
                        <h3>{attempt.quizTitle}</h3>
                        <p>Score: {attempt.score}</p>
                        <p>Time Taken: {attempt.timeTaken} seconds</p>
                        <p>Attempt Date: {new Date(attempt.attemptDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizAnalytics;
