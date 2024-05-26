const express = require('express');
const bodyparser = require('body-parser')
const cors=require('cors')
const app = express();

app.use(cors());
app.use(bodyparser.json())

const singUpModel = require('./models/singupmodel')
const singUpcontroller = require('./controllers/singupControl')

app.use('/user/singup',singUpcontroller.postSingUpData)
singUpModel.sync()

app.use(cors)
app.listen(2000,()=>{
  console.log('server is working');
});