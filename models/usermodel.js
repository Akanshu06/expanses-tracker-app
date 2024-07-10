const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPremiumUser: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;
