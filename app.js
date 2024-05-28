const express = require('express');
const bodyparser = require('body-parser')
const cors=require('cors')
const app = express();

app.use(cors());
app.use(bodyparser.json())

const signUpModel = require('./models/singupmodel')
const userRoutes = require('./routes/userRoute');



app.use('/user',userRoutes);
signUpModel.sync()

app.use(cors)
app.listen(2000,()=>{
  console.log('server is working');
});