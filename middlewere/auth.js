const jwt = require('jsonwebtoken');
const User = require('../models/usermodel'); // Assuming you have a Mongoose model defined in this file

module.exports.authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, 'secretKey');
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }

        // Fetch user from the database using Mongoose
        const foundUser = await User.findById(decoded.userId).exec();
        if (!foundUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Attach user to the request object
        req.user = foundUser;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(400).json({ success: false, error: 'Authentication failed' });
    }
};
