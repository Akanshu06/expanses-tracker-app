const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseControl')
const userAuthorization=require('../middlewere/auth')

router.post('/addexpense',userAuthorization.authenticate,controller.postExpanse);
router.get('/getExpense',userAuthorization.authenticate,controller.getExpanse);
router.delete('/deleteexpense/:id',userAuthorization.authenticate,controller.deleteExpanse);

module.exports=router;