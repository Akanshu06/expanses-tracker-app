const express = require('express');
const bodyparser = require('body-parser')
const cors=require('cors')
const app = express();
const sequelize = require('./database/sequelize')
require('dotenv').config()

app.use(cors());
app.use(bodyparser.json())

const Order= require('./models/premium');
const User = require('./models/usermodel');
const expenses= require('./models/expensemodel')

const userRoutes = require('./routes/userRoute');
const purchaseRuntes=require('./routes/purchase');
const expenseRoutes= require('./routes/expensesRoute')

User.hasMany(expenses);
expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use('/expenses',expenseRoutes)
app.use('/user',userRoutes);
app.use('/purchase',purchaseRuntes)
app.use(cors());



sequelize.sync()
    .then(() => {
        app.listen(2000);
    })
    .catch(err => {
        console.log(err);
    })