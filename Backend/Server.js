const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/config.js");
const Auth = require("./Routes/auth.route.js");
const formationRoutes = require("./Routes/formation.route.js");
const formateurRoutes = require("./Routes/formateur.route.js");
const beneficiaireRoutes = require("./Routes/beneficiaire.route.js");
const coordinateurRoutes = require("./Routes/coordinateur.route.js");
const managerRoutes = require("./Routes/manager.route.js"); // Correction ici
const   evaluationRoutes=require("./Routes/evaluation.route.js")
const cookieParser = require("cookie-parser");
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Connexion à la base de données
connectDB();

// Déclaration des routes
app.use("/api/auth", Auth);
app.use("/api/formation", formationRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);
app.use("/api/coordinateurs", coordinateurRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/formateur",formateurRoutes);
app.use("/api/evaluation",evaluationRoutes);
app.use("/api/formation/Addformation", formationRoutes);


// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});