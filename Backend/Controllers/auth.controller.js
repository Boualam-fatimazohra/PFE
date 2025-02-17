const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');
   const { Utilisateur } = require('../Models/utilisateur.model.js');

   const Login = async (req, res) => {
   const { email, password } = req.body;
   try {
   console.log("Login: Request body:", req.body);
   console.log("Login: Email from request:", email);
   console.log("debut de login avant findOne");
   const user = await Utilisateur.findOne({ email });
   console.log("aprés  findOne");
   if (!user) {
   console.log("Login: User not found");
   return res.status(400).json({ message: 'Invalid email or password' });
   }

   console.log("Login: User found:", user);

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
   console.log("Login: Invalid password");

   return res.status(400).json({ message: 'Invalid email or password' });
   }

   console.log("Login: Password valid");

   const token = jwt.sign(
   { userId: user._id,
   role: user.role,
   firstName: user.nom,
   lastName: user.prenom },
   process.env.JWT_SECRET,
   { expiresIn: '1w' } 
   );

   console.log("Login: Token generated:", token);

   res.cookie('token', token, {
   httpOnly: true, 
   sameSite: 'strict',
   secure: false,
   maxAge: 300000000 
   });

   console.log("Login: Token set in cookie");

   res.status(200).json({ 
   message: 'Login successful',
   role: user.role,
   user: {
   firstName: user.firstName,
   lastName: user.lastName
   }
   });
   console.log("Login: Success de login")

   } catch (error) {
   console.error('Login error:', error);
   res.status(500).json({ message: 'Internal server error' });
   }
   };



//jD5IDdTVLoITMCpL mot de passe mongo 
//mongodb+srv://salouaouissa:<db_password>@cluster0.nwqo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const createUser = async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    
    try {
        if (!nom || !prenom || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        const newUser = new Utilisateur({
            nom,
            prenom,
            email,
            password: hashedPassword, // On stocke le mot de passe hashé
            role: "Admin"
        });

        await newUser.save();

        // Génération du JWT
        const token = jwt.sign(
            { 
                userId: newUser._id,
                role: newUser.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );

        // Configuration du cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production', // Secure en production
            maxAge: 604800000 // 1 semaine
        });

        // Réponse sans informations sensibles
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.prenom,
            lastName: newUser.nom,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({ 
            message: "Administrateur créé avec succès", 
            user: userResponse 
        });

    } catch (error) {
        console.error("Erreur lors de la création:", error);
        res.status(500).json({ 
            message: "Erreur serveur",
            error: error.message 
        });
    }
};

   const Logout = (req, res) => {
   console.log("Logout function called on backend");
   res.clearCookie('token');
   res.status(200).json({ message: 'Logged out successfully' });
   console.log("Token cookie cleared");
   };

   module.exports = { Login, createUser, Logout };
