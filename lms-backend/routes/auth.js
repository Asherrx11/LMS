const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, role, grade } = req.body;

    console.log("Received registration request:", req.body);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        let finalRole = role;
        if (role === 'admin' && email !== process.env.ADMIN_EMAIL) {
            return res.status(403).send({ message: 'Unauthorized to register as admin' });
        }

        let processedGrade = null;
        if (role !== 'admin') {
            processedGrade = grade !== '' ? Number(grade) : null;
        }

        const newUser = new User({
            username,
            email,
            password, // Pass plain password, it will be hashed in the model
            grade: processedGrade,
            role: finalRole
        });

        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        newUser.password = undefined;
        res.status(201).send({ message: 'User registered successfully', token, userId: newUser._id, role: newUser.role, grade: newUser.grade });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).send({ message: 'Login failed, user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.send({ token, userId: user._id, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'An error occurred during login', error: error.message });
    }
});




module.exports = router;
