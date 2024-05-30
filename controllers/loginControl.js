
const { where } = require('sequelize');
const signupData = require('../models/singupmodel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.checkingDetails=async (req,res)=>{
     try{
     const email= req.body.email;
     const password = req.body.password;
     if(stringValidate(email)||stringValidate(password)){
          res.status(400).json({message: 'email or pass missing '})
     }
     const user = await signupData.findOne({ where: { email } });
     if (!user) {
         return res.status(404).json({ message: 'User does not exist' });
     }

     const passwordMatch = await bcrypt.compare(password, user.password);
     if (!passwordMatch) {
         return res.status(401).json({ message: 'Incorrect password' });
     }

     res.status(200).json({ message: 'User logged in successfully' ,token:genrateToken(user.id,user.name)});
     } catch(error){
           console.log(error);
           res.status(500).json({message:'internal error'})
     }
}

function genrateToken(id,name){
    return jwt.sign({signupDatumId:id,name:name},'secretKey');
}

//string validation
function stringValidate(string) {
     return string ===undefined || string.length === 0;
 }