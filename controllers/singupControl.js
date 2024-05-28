const signupModel = require('../models/singupmodel');
const bcrypt = require('bcrypt');

module.exports.postsignUpData = async (req, res) => {
    try {
        const {name,email,password}=req.body
        // Perform validation
        if (stringValidate(name) || stringValidate(email) || stringValidate(password)) {
            return res.status(400).json({ message: 'Name, email, and password are required fields' });
        }

        // Create signup data
        const saltRounds =10;
        bcrypt.hash(password,saltRounds,(err,hash)=>{
              signupModel.create({name,email,password:hash});
              res.status(201).json({message:'new user signup successfully'})
        })

        // Respond with the created data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function stringValidate(string) {
    return string ===undefined || string.length === 0;
}