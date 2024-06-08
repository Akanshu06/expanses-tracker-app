const sequelize = require('sequelize');
const createdSequelize = require('../database/sequelize');

const Table =createdSequelize.define('expenses',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    amount:{
        type:sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:sequelize.STRING,
        allowNull:false
    },
    category:{
        type:sequelize.STRING
    }
});
module.exports=Table;