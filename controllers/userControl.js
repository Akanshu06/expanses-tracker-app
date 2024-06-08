const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.postUser = async (req, res) => {
    try {
        const {name,email,password}=req.body
        // Perform validation
        if (stringValidate(name) || stringValidate(email) || stringValidate(password)) {
            return res.status(400).json({ message: 'Name, email, and password are required fields' });
        }

        // Create signup data
        const saltRounds =10;
        bcrypt.hash(password,saltRounds,(err,hash)=>{
              const user=User.create({name,email,password:hash});
              res.status(201).json({message:'new user signup successfully'})
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//login
module.exports.loginDetails=async (req,res)=>{
    try{
    const email= req.body.email;
    const password = req.body.password;
    if(stringValidate(email)||stringValidate(password)){
         res.status(400).json({message: 'email or pass missing '})
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'User logged in successfully' ,token:genrateToken(user.id)});
    } catch(error){
          console.log(error);
          res.status(500).json({message:'internal error'})
    }
}

module.exports.genrateToken=(id)=>{
   return jwt.sign({userId:id},'secretKey');
}

//string validation
function stringValidate(string) {
    return string ===undefined || string.length === 0;
}
