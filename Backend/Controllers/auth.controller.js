const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("debut de login avant findOne");
        const user = await Utilisateur.findOne({ email });
        console.log("aprés  findOne");

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
            { userId: user._id,
              role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1w' } // Token expiration time
        );

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            sameSite: 'strict',// Prevent CSRF attacks
            secure: false,
            maxAge: 300000000 // Cookie expiration time in milliseconds (1 hour)
        });

        res.status(200).json({ 
            message: 'Login successful',
            role: user.role
        });
        console.log("success de login")

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//jD5IDdTVLoITMCpL mot de passe mongo 
//mongodb+srv://salouaouissa:<db_password>@cluster0.nwqo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Vérification de l'existence de l'utilisateur
        const existingUser = await Utilisateur.findOne({ email });
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

        // Génération du JWT après la sauvegarde de l'utilisateur
        const token = jwt.sign(
            { 
                userId: newUser._id, // Utilisation de newUser au lieu de user
                role: newUser.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );

        // Configuration du cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
              secure: false ,
            maxAge: 604800000 // 1 semaine en millisecondes
        });

        // Réponse sans le mot de passe
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({ 
            message: "Utilisateur créé avec succès", 
            user: userResponse 
        });

    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ 
            message: "Erreur serveur",
            error:error.message 
        });
    }
};

module.exports = { Login, createUser };
