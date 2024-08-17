// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401); // No token provided
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).send({ message: 'Invalid token' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).send({ message: 'Token verification failed' });
    }
};

module.exports = authenticateToken;
