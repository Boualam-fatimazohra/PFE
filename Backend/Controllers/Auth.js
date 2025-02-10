const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("debut de login avant findOne");
        const user = await Utilisateur.findOne({ email });
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


//jD5IDdTVLoITMCpL mot de passe mongo 
//mongodb+srv://salouaouissa:<db_password>@cluster0.nwqo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const createUser = async (req, res) => {
    const {firstName,lastName,email,password}=req.body;
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await Utilisateur.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = new Utilisateur({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role:"Formateur"
        });

        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { Login, createUser };
