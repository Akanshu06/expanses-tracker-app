
const { where } = require('sequelize');
const signupData = require('../models/singupmodel')

module.exports.checkingDetails=async (req,res)=>{
     const email= req.body.email;
     const password = req.body.password;
     if(stringValidate(email)||stringValidate(password)){
          res.status(400).json({message: 'email or pass are missing'})
     }
     const saveUser =  await signupData.findAll({where:{email}})
     try{
          if(saveUser.length === 0){
               res.status(401).json({massage:'password or email is in correct'})
          }else{
               res.status(200).json({message:'login sucsses'})
          }
     } catch(error){
           console.log(error);
           res.status(500).json({message:'internal error'})
     }
}

//string validation
function stringValidate(string) {
     return string ===undefined || string.length === 0;
 }