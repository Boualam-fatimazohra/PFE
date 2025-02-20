const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');
const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Utilisateur.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({
        userId: user._id,
        role: user.role,
        firstName: user.nom,
        lastName: user.prenom
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 300000000
      });
  
      return res.status(200).json({
        message: 'Login successful',
        role: user.role,
        user: {
          nom: user.nom,
          prenom: user.prenom
        }
      });
  
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
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

module.exports = { Login, createUser, Logout };