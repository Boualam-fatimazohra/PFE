const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel');

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // If user is not found, return an error 
        if (!user) {
            console.log("Invalid email or password");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid email or password");

            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1w' } // Token expiration time
        );

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 300000000 // Cookie expiration time in milliseconds (1 hour)
        });

        res.status(200).json({ 
            message: 'Login successful',
            role: user.role
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { Login };
//jD5IDdTVLoITMCpL mot de passe mongo 
//mongodb+srv://salouaouissa:<db_password>@cluster0.nwqo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0