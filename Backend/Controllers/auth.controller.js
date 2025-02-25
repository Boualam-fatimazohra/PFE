const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');
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