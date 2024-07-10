const express = require('express');
const cors = require('cors');
//const helmet=require('helmet')
const compression= require('compression');
const app = express();
const path= require('path')

const fs= require('fs')
require('dotenv').config();
const sequelize = require('./database/sequelize');


const accessLogPath = path.join(__dirname, 'access.log');
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });

app.use(cors());
app.use(compression());
app.use(express.json());

const Order = require('./models/premium');
const User = require('./models/usermodel') ;
const Expense = require('./models/expensemodel');
const FileUrl = require('./models/url');
const ForgetPasswordRequest = require('./models/password');

// Define associations
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgetPasswordRequest);
ForgetPasswordRequest.belongsTo(User);
User.hasMany(FileUrl);
FileUrl.belongsTo(User);

const userRoutes = require('./routes/userRoute');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumRoute');
const passwordRoutes = require('./routes/passwordRoute');


// Use routes

app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', passwordRoutes);

app.use((req,res)=>{
  console.log(req.url);
  res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

const port = process.env.PORT || 2000;
// Start server
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });
