const signupModel = require('../models/singupmodel');

module.exports.postsignUpData = async (req, res) => {
    try {
        const {name,email,password}=req.body
        // Perform validation
        if (stringValidate(name) || stringValidate(email) || stringValidate(password)) {
            return res.status(400).json({ message: 'Name, email, and password are required fields' });
        }

        // Create signup data
        const signupData = await signupModel.create({
            name: name,
            email: email,
            password: password
        });

        // Respond with the created data
        res.status(200).json({ signupData: signupData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function stringValidate(string) {
    return string ===undefined || string.length === 0;
}