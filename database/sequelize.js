const sequlize = require('sequelize');
//require('dotenv').config();
const Sequlize = new sequlize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

module.exports = Sequlize;