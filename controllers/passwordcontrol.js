const User = require('../models/usermodel');
const ForgetPasswordRequest = require('../models/password'); // Renamed for consistency
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');
const { response } = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Set up transporter with your SMTP server details


module.exports.forgetPassword = async (req, res) => {
   try {
      const email = req.body.mail;
      const user = await User.findOne({ where: { email } });
      if (!user) {
         return res.status(404).json({ success: false, message: 'Invalid email ID' });
      }

      const id = uuidv4();

      // Create a forgot password request
      await ForgetPasswordRequest.create({ userId: user.id, id, active: true });
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASSWORD,
         },
      });

      // Send email using Nodemailer transporter
      const info = await transporter.sendMail({
         from: process.env.GMAIL,
         to: email,
         subject: 'Reset Your Password',
         text: 'Follow the link to reset your password',
         html: `<a href="http:// 3.109.184.246:2000//password/reset_password/${id}">Reset password</a>`,
      });

      console.log("Message sent: %s", info.messageId);

      return res.status(201).json({ message: 'Link to reset password sent to your email', success: true });

   } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Some issue in forgetPassword', success: false });
   }
}

exports.resetPassword = (req, res) => {
   const id = req.params.id;
   ForgetPasswordRequest.findOne({ where: { id } }).then(forgotpasswordrequest => {
      if (forgotpasswordrequest) {
         forgotpasswordrequest.update({ active: false });
         res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
         )
         res.end()
      }
   })
}

exports.updatepassword = async (req, res) => {
   try {
      
      const newpassword  = req.query.newpassword

      
     // console.log('newpassword1==>'+newpassword);
      const id = req.params.id;
      const forgetPasswordRequest = await ForgetPasswordRequest.findOne({where:{ id: id }});
      console.log(forgetPasswordRequest.userId);
      const user = await User.findOne({where:{ id: forgetPasswordRequest.userId }});
      if (user) {
         //encrypt the password
console.log(user);
         const saltRounds = 10;
         
            bcrypt.hash(newpassword, saltRounds, function (err, hash) {
               // Store hash in your password DB.
               if (err) {
                  console.log(err);
                  throw new Error(err);
               }
               user.update({ password: hash }).then(() => {
                  res.status(201).json({ message: 'Successfuly update the new password' })
               })
            });
         
      } else {
         return res.status(404).json({ error: 'No user Exists', success: false })
      }
   } catch (error) {
      return res.status(403).json({ error, success: false })
   }

}