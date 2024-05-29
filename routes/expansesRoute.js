const express = require('express');
const router = express.Router();
const controller = require('../controllers/expanseControl')

router.post('/addExpanse',controller.postExpanse);
router.get('/getExpanse',controller.getExpanse);
router.delete('/deleteExpanse/:id',controller.deleteExpanse);

module.exports=router;