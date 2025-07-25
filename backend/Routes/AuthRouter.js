const express = require('express');
const router = express.Router();
const User = require('../Models/Users'); // Correct path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists. Please login.',
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Signup successful", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found. Please sign up.',
                success: false
            });
        }

        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid password',
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, 'secret-123', {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

module.exports = router;
