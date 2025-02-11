const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js');
const formateurRoute = require('./Routes/formateur.route.js');
const evaluationRoutes = require("./Routes/evaluationRoute");
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware AVANT les routes
app.use(express.json());  // Permet à Express de parser les requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// ✅ Connexion à la base de données
connectDB();

// ✅ Définition des routes APRES les middlewares
app.use('/api/auth', Auth);
app.use('/api/formateur', formateurRoute);
app.use("/api/evaluation", evaluationRoutes);

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
