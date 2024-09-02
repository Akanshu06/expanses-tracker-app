const express = require('express');
const router=express.Router();
const controller= require('../controllers/purchaseControl');
const userAuthorization=require('../middlewere/auth')


 router.get('/premiummembership',userAuthorization.authenticate,controller.purchasePremium);
 router.post('/purchasetransactionstatus',userAuthorization.authenticate,controller.purchasetransactionstatus)
 router.get('/premiumFeature',userAuthorization.authenticate,controller.getUserLeaderBoard);

module.exports=router;