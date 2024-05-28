const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const signupData = sequelize.define('signupData', { 
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = signupData;