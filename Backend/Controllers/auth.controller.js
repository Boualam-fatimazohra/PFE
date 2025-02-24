const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const generateRandomPassword = require('../utils/generateRandomPassword.js');
const {sendMail} = require('../Config/auth.js');
//
const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login: Request body:", req.body);
        const user = await Utilisateur.findOne({ email });

        if (!user) {
            console.log("Login: User not found");
            return res.status(400).json({ message: 'User not found' });
        }

        console.log("Login: User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Login: Invalid password");
            return res.status(400).json({ message: 'Invalid password' });
        }

        console.log("Login: Password valid");

        // Ajout de logs pour vérifier les valeurs
        console.log("Login: Nom =", user.nom);
        console.log("Login: Prénom =", user.prenom);
        console.log("Login: Role =", user.role);

        if (!user.nom || !user.prenom || !user.role) {
            console.error("Login: Missing user fields", { nom: user.nom, prenom: user.prenom, role: user.role });
            return res.status(500).json({ message: "User data is incomplete" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, nom: user.nom, prenom: user.prenom },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 300000000
        });

        console.log("Login: Sending response...");
        res.status(200).json({ 
            message: 'Login successful',
            role: user.role,
            user: { 
                nom: user.nom, 
                prenom: user.prenom,
                userId: user._id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
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
        const hashedPassword = await bcrypt.hash(password, 10); 

    // Création de l'utilisateur
    const newUser = new Utilisateur({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role:"Manager"
    });

await newUser.save();
const token = jwt.sign(
{ 
userId: newUser._id, 
role: newUser.role 
},
process.env.JWT_SECRET,
{ expiresIn: '1w' }
);

res.cookie('token', token, {
httpOnly: true,
sameSite: 'strict',
secure: false ,
maxAge: 604800000 
});
const userResponse = {
_id: newUser._id,
firstName: newUser.nom,
lastName: newUser.prenom,
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
const Logout = (req, res) => {
console.log("Logout function called on backend");
res.clearCookie('token');
res.status(200).json({ message: 'Logged out successfully' });
console.log("Token cookie cleared");
};
// auth.controller.js


const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Utilisateur.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

     // Vérifier si les champs existent dans l'instance et les ajouter si nécessaires
    //  if (user.resetPasswordCode === undefined) {
    //     user.resetPasswordCode = null;
    // }
    // if (user.resetPasswordExpires === undefined) {
    //     user.resetPasswordExpires = null;
    // }
    const resetCode = generateRandomPassword();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure

    await user.save();

    // Générer un JWT contenant l'email
    const token = jwt.sign({userId:user._id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
     console.log("Générer un JWT contenant l'email")
    // Stocker le JWT dans un cookie sécurisé
    res.cookie("token",token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 heure
    });

    // Envoyer l'email
    await sendMail(email, `Votre code de réinitialisation : ${resetCode}`);

    res.status(200).json({ message: "Code envoyé par email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const VerifyResetCode = async (req, res) => {
    const { code } = req.body;
    try {
        const email = req.user?.email; //  Récupération directe via le middleware
        if (!email) return res.status(400).json({ message: "Email non trouvé dans le token" });

        console.log("Récupération directe via le middleware", email);

        // Récupérer l'utilisateur sans chercher `resetPasswordCode` dans la requête
        const user = await Utilisateur.findOne({
            email,
            resetPasswordExpires: { $gt: Date.now() }, // Vérifier l'expiration
        });

        if (!user || !user.resetPasswordCode) {
            return res.status(400).json({ message: "Code invalide ou expiré" });
        }

        // Comparer le code reçu avec le code haché
        const isCodeValid = await bcrypt.compare(code, user.resetPasswordCode);
        if (!isCodeValid) {
            return res.status(400).json({ message: "Code invalide ou expiré" });
        }

        console.log("Code vérifié, utilisateur trouvé :", user);
        res.status(200).json({ message: "Code vérifié" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const ChangePassword = async (req, res) => {
    const { newPassword } = req.body;
  
    try {
      const email = req.user?.email; // Récupérer l'email à partir du token
  
      if (!email) return res.status(400).json({ message: "Email non trouvé dans le token" });
  
      // Vérification que le mot de passe est valide (par exemple, 8 caractères avec des majuscules, minuscules, chiffres, et caractères spéciaux)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: "Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial",
        });
      }
  
      // Trouver l'utilisateur à partir de l'email
      const user = await Utilisateur.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mettre à jour le mot de passe dans la base de données
      user.password = hashedPassword;
      user.resetPasswordCode = null; // Supprimer le code de réinitialisation
      user.resetPasswordExpires = null; // Supprimer l'expiration du code
      await user.save();
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Assure-toi que le cookie est bien supprimé en production avec HTTPS
        sameSite: 'Strict',
      });
      console.log("Mot de passe modifié avec succès");
      // Répondre à l'utilisateur que le mot de passe a été modifié
      res.status(200).json({ message: "Mot de passe modifié avec succès" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { Login, createUser, Logout ,ForgotPassword,VerifyResetCode,ChangePassword};