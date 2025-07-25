const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    const token = authHeader.split(' ')[1]; // ✅ Remove "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};

module.exports = ensureAuthenticated ;
