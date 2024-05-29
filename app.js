const express = require('express');
const bodyparser = require('body-parser')
const cors=require('cors')
const app = express();

app.use(cors());
app.use(bodyparser.json())

const signUpModel = require('./models/singupmodel');
const expansemodel= require('./models/expansemodel')
const userRoutes = require('./routes/userRoute');



app.use('/expanses',require('./routes/expansesRoute'))
app.use('/user',userRoutes);
signUpModel.sync();
expansemodel.sync();

app.use(cors)
app.listen(2000,()=>{
  console.log('server is working');
});