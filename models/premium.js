const mongoose = require('mongoose');

// Define the schema for the Order
const orderSchema = new mongoose.Schema({
  paymentid: {
    type: String,
    //required: true
  },
  orderid: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

// Create the model from the schema
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;
