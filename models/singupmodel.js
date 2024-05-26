const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');

const singupData = sequelize.define('singupData', { 
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = singupData;