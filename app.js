const express = require('express');
const bodyparser = require('body-parser')
const cors=require('cors')
const app = express();
const sequelize = require('./database/sequelize')

app.use(cors());
app.use(bodyparser.json())

const User = require('./models/singupmodel');
const Expanses= require('./models/expansemodel')
const userRoutes = require('./routes/userRoute');

User.hasMany(Expanses);
Expanses.belongsTo(User);

app.use('/expanses',require('./routes/expansesRoute'))
app.use('/user',userRoutes);
app.use(cors());

sequelize.sync()
    .then(() => {
        app.listen(2000);
    })
    .catch(err => {
        console.log(err);
    })