const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number,
        default: 0
    },
    links: [{
        URL: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;
