const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mr_user:VGp3SZ97BkcVVhUc@cluster0.biulffi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
