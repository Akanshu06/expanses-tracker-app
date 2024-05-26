const sequlize = require('sequelize');
const Sequlize = new sequlize('new_schema','root','mysql',{
    host:'localhost',
    dialect:'mysql'
})

module.exports = Sequlize;