const express = require('express');
const  router = express.Router();
const userController = require('../controllers/userControl');
const expenseControl= require('../controllers/expenseControl');
const userAuthorization=require('../middlewere/auth');


router.post('/signup',userController.signup);
router.post('/login',userController.loginDetails);

router.post('/addexpense',userAuthorization.authenticate,expenseControl.postExpense);
router.get('/getexpense',userAuthorization.authenticate,expenseControl.getExpense);
router.delete('/deleteexpense/:id',userAuthorization.authenticate,expenseControl.deleteExpense);
 router.get('/download',userAuthorization.authenticate,expenseControl.download);
 router.get('/geturl',userAuthorization.authenticate,expenseControl.getURL);



module.exports=router;