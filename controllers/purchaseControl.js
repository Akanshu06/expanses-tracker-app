const Order = require('../models/premium'); // Make sure this is updated to use Mongoose
const User = require('../models/usermodel'); // Make sure this is updated to use Mongoose
const userController = require('./userControl');
const mongoose = require('mongoose');
require('dotenv').config();
const Razorpay = require('razorpay');

module.exports.purchasePremium = async (req, res) => {
    try {
       // console.log(process.env.RAZORPAY_KEY_ID);
        
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                console.log(err);
                throw new Error(JSON.stringify(err));
            }
            try {
                // Assuming req.user is available and has an id
                await Order.create({
                    userId: req.user.id, // You need to ensure this field exists in your Order schema
                    orderid: order.id,
                    status: 'PENDING'
                });
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

module.exports.purchasetransactionstatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
console.log('pament',payment_id);
        // Find the order by order_id
        const order = await Order.findOne({ orderid: order_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the order with payment_id and status
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        // Update the User to mark them as a premium user
        await User.findByIdAndUpdate(userId, { isPremiumUser: true });

        // Generate a new token with updated user information
        const token = userController.generateToken(userId, undefined, true);

        // Send response
        return res.status(202).json({ success: true, message: 'Transaction Successful', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message, message: 'Something went wrong' });
    }
};

module.exports.getUserLeaderBoard = async (req, res) => {
    try {
        // Fetch and sort users by 'total' in descending order
        const leaderboard = await User.find({})
            .sort({ total: -1 }) // Sort by 'total' in descending order
            .exec(); // Execute the query

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the leaderboard', error: error.message });
    }
};
