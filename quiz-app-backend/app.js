const express = require('express');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quizRoutes');
const quizAttemptRoutes = require('./routes/quizAttemptRoutes'); 
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
}));

app.use('/api/quizzes', quizRoutes); 
app.use('/api/quiz-attempts', quizAttemptRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
