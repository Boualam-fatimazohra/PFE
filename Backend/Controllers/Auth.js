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
   firstName: user.firstName,
   lastName: user.lastName },
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
   const { firstName, lastName, email, password } = req.body;

   try {
   const existingUser = await Utilisateur.findOne({ email });
   if (existingUser) {
   return res.status(400).json({ message: "L'utilisateur existe déjà" });
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = new Utilisateur({
   firstName,
   lastName,
   email,
   password: hashedPassword,
   role: "Formateur"
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

   const Logout = (req, res) => {
   console.log("Logout function called on backend");
   res.clearCookie('token');
   res.status(200).json({ message: 'Logged out successfully' });
   console.log("Token cookie cleared");
   };

   module.exports = { Login, createUser, Logout };
