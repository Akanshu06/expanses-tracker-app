const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControl')


router.post('/signup',userController.postUser);
router.post('/login',userController.loginDetails)


module.exports=router;