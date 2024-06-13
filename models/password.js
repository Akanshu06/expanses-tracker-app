const Data_types=require('sequelize');
const sequelize=require('../database/sequelize');


const forgetPasswordRequest = sequelize.define('forgetRequest',{
      id:{
        type:Data_types.UUID,
        allowNull:false,
        primaryKey:true
      },
      active: Data_types.BOOLEAN,
      expiresby: Data_types.DATE
});

module.exports=forgetPasswordRequest;