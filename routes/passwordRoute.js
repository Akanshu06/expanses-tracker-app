const express = require('express');
const router = express.Router();
const userController = require('../controllers/passwordcontrol')


router.post('/forget-password',userController.CheakPassword);



module.exports=router;