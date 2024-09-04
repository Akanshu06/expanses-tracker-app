const mongoose = require('mongoose');
const Expense = require('../models/expenseModel'); 
const User = require('../models/usermodel'); 
const s3Service=require('../service/s3');
require('dotenv').config();
const {Parser} = require('json2csv');

const getURL = async (req, res) => {
    try {
        // Find the user by ID and populate the links field
        const user = await User.find(req.user.id).select('links');
        if (!user || !user.links || user.links.length === 0) {
            return res.status(404).json({ error: 'No URLs found for this user' });
        }

        // Respond with the list of URLs
        res.status(200).json({ urls: user.links });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const download = async (req, res) => {
    try {
       
        const expenses = await Expense.find({ userId: req.user._id });

        // Prepare data for CSV
        const fields = ['date', 'description', 'amount', 'category']; // Specify the fields to include in the CSV
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(expenses);

        // Set headers and send CSV file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
        return res.status(200).send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getExpense = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const ITEMS_PER_PAGE = 3;

        console.log('Requested Page:', page);

        // Ensure page number is positive
        if (page < 1) {
            console.log('Error: Page number must be greater than 0');
            return res.status(400).json({ error: 'Page number must be greater than 0' });
        }

        // Get total number of expenses
        const totalItems = await Expense.countDocuments({ userId: req.user.id });
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // Fetch expenses with pagination
        const expenses = await Expense.find({ userId: req.user.id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.status(200).json({
            expenses,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: totalPages,
        });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};


const postExpense = async (req, res) => {
    const session = await mongoose.startSession(); // Start a new session for the transaction
    session.startTransaction();
    try {
        const { amount, description, category } = req.body;

        // Check for invalid parameters
        if (!amount || !description || !category) {
            res.status(400).json({ success: false, message: 'Bad parameter' });
            return;
        }

        // Create a new expense
        const newExpense = new Expense({
            amount,
            description,
            category,
            userId: req.user.id 
        });

        // Save the expense within the transaction
        await newExpense.save({ session });

        // Update the user's total expense
        const user = await User.findById(req.user.id).session(session);
        if (!user) {
            throw new Error('User not found');
        }
        user.total = Number(user.total) + Number(amount);
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ expenses: newExpense });
    } catch (error) {
        // Rollback the transaction if an error occurs
        await session.abortTransaction();
        session.endSession();

        console.error('Error posting expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteExpense = async (req, res) => {
    const session = await mongoose.startSession(); // Start a new session for the transaction
    session.startTransaction();
    try {
        const eId = req.params.id;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(eId)) {
            res.status(400).json({ success: false, message: 'ID is incorrect' });
            return;
        }

        // Find the expense to delete
        const expenseToDelete = await Expense.findOne({ _id: eId, userId: req.user.id }).session(session);
        if (!expenseToDelete) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }

        // Delete the expense
        const deleteResult = await Expense.deleteOne({ _id: eId, userId: req.user.id }).session(session);
        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }

        // Update the user's total expense
        const user = await User.findById(req.user.id).session(session);
        if (!user) {
            throw new Error('User not found');
        }
        user.total = Number(user.total) - Number(expenseToDelete.amount);
        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        // Rollback the transaction if an error occurs
        await session.abortTransaction();
        session.endSession();

        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function isValid(data) {
   return data === undefined || data === null || (typeof data === 'string' && data.trim().length === 0);
}

module.exports={
   getExpense,postExpense,deleteExpense,download,getURL
}