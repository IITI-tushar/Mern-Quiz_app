const express = require('express');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quizRoutes');
const quizAttemptRoutes = require('./routes/quizAttemptRoutes'); 
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // JWT import
const authRoutes = require('./routes/authRoutes'); // Import auth routes

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
}));

// JWT authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/quizzes', authenticateJWT, quizRoutes); 
app.use('/api/quiz-attempts', authenticateJWT, quizAttemptRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
