const User = require('../models/usermodel');
const ForgetPasswordRequest = require('../models/password'); // Assuming you renamed the file correctly
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set up transporter with your SMTP server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

module.exports.forgetPassword = async (req, res) => {
    try {
        const email = req.body.mail;
        
        const user = await User.findOne({ email }); // Mongoose findOne query
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid email ID' });
        }

        const id = uuidv4();
        const expiresby = new Date(Date.now() + 3600000);
        // Create a forgot password request
        await ForgetPasswordRequest.create({ userId: user._id, id, active: true,expiresby:expiresby });

        // Send email using Nodemailer transporter
        const info = await transporter.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject: 'Reset Your Password',
            text: 'Follow the link to reset your password',
            html: `<a href="http://localhost:3000/password/reset_password/${id}">Reset password</a>`,
        });

        console.log("Message sent: %s", info.messageId);

        return res.status(201).json({ message: 'Link to reset password sent to your email', success: true });

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Some issue in forgetPassword', success: false });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const forgotPasswordRequest = await ForgetPasswordRequest.findOne({ id });

        if (forgotPasswordRequest) {
            await ForgetPasswordRequest.updateOne({ id }, { $set: { active: false } });

            res.status(200).send(`
                <html>
                    <script>
                        function formsubmitted(e){
                            e.preventDefault();
                            console.log('called');
                        }
                    </script>
                    <form action="/password/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>Reset Password</button>
                    </form>
                </html>
            `);
        } else {
            res.status(404).json({ message: 'Invalid or expired request' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing request' });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const newPassword = req.query.newpassword;
        const id = req.params.id;

        const forgetPasswordRequest = await ForgetPasswordRequest.findOne({ id });

        if (forgetPasswordRequest && !forgetPasswordRequest.active) {
            const user = await User.findById(forgetPasswordRequest.userId);

            if (user) {
                const saltRounds = 10;

                bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Error hashing password', success: false });
                    }

                    await User.updateOne({ _id: user._id }, { $set: { password: hash } });
                    return res.status(201).json({ message: 'Password updated successfully', success: true });
                });

            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(400).json({ error: 'Invalid or expired request', success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: error.message, success: false });
    }
}
