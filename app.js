const express = require('express');
//const bodyparser = require('body-parser')
const cors = require('cors')
const app = express();
const sequelize = require('./database/sequelize')
require('dotenv').config()

app.use(cors());
app.use(express.json())

const Order = require('./models/premium');
const User = require('./models/usermodel');
const expenses = require('./models/expensemodel');
const forgetPasswordRequest= require('./models/password');


const userRoutes = require('./routes/userRoute');
const purchaseRuntes = require('./routes/purchase');
const expenseRoutes = require('./routes/expensesRoute');
const premiumFeatureRoutes = require('./routes/premiumRoute');
const passwordRoutes=require('./routes/passwordRoute');

User.hasMany(expenses);
expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgetPasswordRequest);
forgetPasswordRequest.belongsTo(User);

app.use('/expenses', expenseRoutes)
app.use('/user', userRoutes);
app.use('/purchase', purchaseRuntes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password',passwordRoutes)

app.use(cors());



sequelize.sync()
    .then(() => {
        app.listen(2000);
    })
    .catch(err => {
        console.log(err);
    })