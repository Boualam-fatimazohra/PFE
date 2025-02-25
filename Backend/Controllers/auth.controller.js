const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const Login = async (req, res) => {
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

        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Création de l'utilisateur
    const newUser = new Utilisateur({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role:"Formateur"
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
nom: newUser.nom,
prenom: newUser.prenom,
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

module.exports = { Login, createUser, Logout };