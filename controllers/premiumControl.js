const Users = require('../models/usermodel'); // Make sure this uses Mongoose
const mongoose = require('mongoose');

const getUserLeaderBoard = async (req, res) => {
    try {
        // Fetch and sort users by 'total' in descending order
        const leaderboard = await Users.find({})
            .sort({ total: -1 }) // Sort by 'total' in descending order
            .exec(); // Execute the query

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the leaderboard', error: error.message });
    }
};

module.exports = { getUserLeaderBoard };
