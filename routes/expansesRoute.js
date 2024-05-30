const express = require('express');
const router = express.Router();
const controller = require('../controllers/expanseControl')
const userAuthorization=require('../middlewere/auth')

router.post('/addExpanse',userAuthorization.authenticate,controller.postExpanse);
router.get('/getExpanse',userAuthorization.authenticate,controller.getExpanse);
router.delete('/deleteExpanse/:id',userAuthorization.authenticate,controller.deleteExpanse);

module.exports=router;