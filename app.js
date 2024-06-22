const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./database/sequelize');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Import Sequelize models
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



// Import routes
const userRoutes = require('./routes/userRoute');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumRoute');
const passwordRoutes = require('./routes/passwordRoute');

// Use routes

app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', passwordRoutes);


// Start server
sequelize.sync()
  .then(() => {
    app.listen(2000, () => {
      console.log('Server is running on port 2000');
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });
