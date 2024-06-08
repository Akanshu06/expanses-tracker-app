const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');


const User = sequelize.define('user', { 
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
    },
    ispremiumuser:DataTypes.BOOLEAN
});

module.exports = User;