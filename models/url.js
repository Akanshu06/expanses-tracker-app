const sequelize=require('../database/sequelize');
const DataTypes=require('sequelize');
const User= require('./usermodel')

const linkUrl=sequelize.define('URLS',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    URL:DataTypes.STRING
})

module.exports=linkUrl;