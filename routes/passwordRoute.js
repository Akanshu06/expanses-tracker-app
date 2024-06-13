const express = require('express');
const router = express.Router();
const userController = require('../controllers/passwordcontrol')


router.use('/forget-password',userController.forgetPassword);
router.get('/reset_password/:id',userController.resetPassword);
router.get('/updatepassword/:id',userController.updatepassword);


module.exports=router;