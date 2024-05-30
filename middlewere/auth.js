const jwt=require('jsonwebtoken');
const User = require('../models/singupmodel');

module.exports.authenticate = async(req,res,next)=>{
   try {
    const token = req.header('authorization');
    console.log();
    const user=jwt.verify(token,'secretKey');
    console.log('userId==>'+user.signupDatumId);
    User.findByPk(user.signupDatumId).then(user=>{
        req.user=user;
        next();
    })
   } catch (error) {
    return res.status(400).json({success:false})
   }
   
}