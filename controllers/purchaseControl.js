
const { where } = require('sequelize');
const Order=require('../models/premium');
const User=require('../models/usermodel');
//const signup=require('../models/singupmodel');
const userController=require('./userControl');
require('dotenv').config();
const Razorpay = require('razorpay');

module.exports.purchasePremium=async(req,res)=>{
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                console.log(err);
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

module.exports.purchasetransactionstatus = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { payment_id, order_id } = req.body;

        // Find the order by order_id
        const order = await Order.findOne({ where: { orderid: order_id } });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the order with payment_id and status
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        // Update the User to mark them as a premium user
        await User.update({ isPremiumUser: true }, { where: { id: userId } });

        // Generate a new token with updated user information
        const token = userController.genrateToken(userId, undefined, true);

        // Send response
        return res.status(202).json({ success: true, message: 'Transaction Successful', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message, message: 'Something went wrong' });
    }
};