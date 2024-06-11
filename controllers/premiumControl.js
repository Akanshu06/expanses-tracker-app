const Expenses = require('../models/expensemodel');
const Users = require('../models/usermodel');
const sequelize = require('../database/sequelize');



const getUserLeaderBoard = async (req, res) => {
    try {

        const leaderboard = await Users.findAll({

            order: [['total', 'DESC']]
        });

        res.status(200).json(leaderboard);


    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUserLeaderBoard };
