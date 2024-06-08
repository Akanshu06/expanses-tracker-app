const jwt=require('jsonwebtoken');
const User = require('../models/usermodel');

module.exports.authenticate = async(req,res,next)=>{
   try {
    const token = req.header('Authorization');
    const decodedToken = jwt.verify(token, 'secretKey');
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
        throw new Error('User not found');
    }
     req.user=user;
     next();

   } catch (error) {
    return res.status(400).json({success:false});
   }
   
}