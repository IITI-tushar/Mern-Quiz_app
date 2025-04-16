const express = require('express');
const User = require('../models/user');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { admin, teacher, student } = require('../middleware/authMiddleware');

// Route to get all users (admin only)
router.get('/', authenticateJWT, admin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Route to update user role (admin only)
router.put('/:id/role', authenticateJWT, admin, async (req, res) => {
    const { role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = role;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

// Route to get user profile (authenticated users)
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

module.exports = router;
