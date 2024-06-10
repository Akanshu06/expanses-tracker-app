const express = require('express');
const router = express.Router();
const userAuthorization=require('../middlewere/auth');
const premiumController= require('../controllers/premiumControl');

router.get('/premiumFeature',userAuthorization.authenticate,premiumController.getUserLeaderBoard);

module.exports=router;
