const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseControl')
const userAuthorization=require('../middlewere/auth')

router.post('/addexpense',userAuthorization.authenticate,controller.postexpense);
router.get('/getExpense',userAuthorization.authenticate,controller.getexpense);
router.delete('/deleteexpense/:id',userAuthorization.authenticate,controller.deleteexpense);


module.exports=router;