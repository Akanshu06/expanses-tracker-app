const express = require('express');
const  router = express.Router();
const userController = require('../controllers/userControl');
const expenseControl= require('../controllers/expenseControl');
const userAuthorization=require('../middlewere/auth');


router.post('/signup',userController.signup);
router.post('/login',userController.loginDetails)

router.get('/download',userAuthorization.authenticate,expenseControl.download);
router.get('/geturl',userAuthorization.authenticate,expenseControl.getURL);

router.post('/addexpense',userAuthorization.authenticate,expenseControl.postexpense);
router.get('/getexpense',userAuthorization.authenticate,expenseControl.getexpense);
router.delete('/deleteexpense/:id',userAuthorization.authenticate,expenseControl.deleteexpense);


module.exports=router;