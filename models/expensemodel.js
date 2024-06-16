const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Expense = sequelize.define('Expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING
  }
});

module.exports = Expense;
