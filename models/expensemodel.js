const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: {
        type: Number, // Mongoose uses Number for numerical values
        required: true
    },
    description: {
        type: String, // Mongoose uses String for text values
        required: true
    },
    category: {
        type: String // Optional field
    },
    userId: { // Assuming a reference to a User model
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Optional: Adds createdAt and updatedAt fields
});

// Create a model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
