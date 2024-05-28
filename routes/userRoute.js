const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControl')
const signupController = require('../controllers/singupControl')


router.post('/signup',signupController.postsignUpData);
router.post('/login',loginController.checkingDetails)


module.exports=router;