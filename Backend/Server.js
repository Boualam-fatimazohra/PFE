const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.route.js');
const formationRoutes = require('./Routes/formation.route.js');
const formateurRoutes = require('./Routes/formateur.route.js');

const evaluationRoutes = require("./Routes/evaluationRoute.js");
const beneficiaireRoutes = require("./Routes/beneficiaire.route.js");
const coordinateurRoutes = require("./Routes/coordinateur.route.js");
const managerRoutes = require("./Routes/manager.route");
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  // Permet à Express de parser les requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

connectDB();
app.use('/api/auth', Auth);
app.use('/api/formation', formationRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);
app.use("/api/coordinateurs", coordinateurRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/formateur",formateurRoutes)
app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`);
});
