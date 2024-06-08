const sequelize = require('../database/sequelize');
const Sequelize = require('sequelize');

const Order = sequelize.define('orders', { 
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
})
module.exports=Order;