const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js');
const formateurRoute = require('./Routes/formateur.route.js');
const evaluationRoutes = require("./Routes/evaluationRoute");
const cookieParser = require('cookie-parser');

// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());  // Permet à Express de parser les requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true,
}));

// ✅ Connexion à la base de données avant de démarrer le serveur
connectDB()
  .then(() => {
    // ✅ Définition des routes APRES la connexion
    app.use('/api/auth', Auth);
    app.use('/api/formateur', formateurRoute);
    app.use("/api/evaluation", evaluationRoutes);

    // ✅ Lancement du serveur
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion à la base de données:", error);
    process.exit(1); // Arrêter le serveur en cas d'échec de connexion
  });
