const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const expenses = require('../models/expensemodel');


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Perform validation
        if (stringValidate(name) || stringValidate(email) || stringValidate(password)) {
            return res.status(400).json({ message: 'Name, email, and password are required fields' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Respond with success
        res.status(201).json({ message: 'New user signed up successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//login
const loginDetails = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (stringValidate(email) || stringValidate(password)) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        // Compare provided password with stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        // Generate a JWT token
        const token = generateToken(user._id, user.name, user.isPremiumUser);
        // Send success response with token
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


 const generateToken = (id, name, value) => {
    return jwt.sign({userId: id, name: name, ispremiumuser:value}, 'secretKey');
}

//string validation
function stringValidate(string) {
    return string === undefined || string.length === 0;
}

module.exports = {
    signup,
    loginDetails,
    generateToken
}