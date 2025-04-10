const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/config.js");
const Auth = require("./Routes/auth.route.js");
const userRoutes = require("./Routes/user.route.js")
const formationRoutes = require("./Routes/formation.route.js");
const formateurRoutes = require("./Routes/formateur.route.js");
const beneficiaireRoutes = require("./Routes/beneficiaire.route.js");
const coordinateurRoutes = require("./Routes/coordinateur.route.js");
const managerRoutes = require("./Routes/manager.route.js");
const evaluationRoutes = require("./Routes/evaluation.route.js");
const evenementRoutes = require("./Routes/evenement.route.js");
const notificationRoutes = require("./Routes/notification.route.js");
const Presence=require("./Routes/presence.route.js")
const entityRoutes = require("./Routes/entity.route.js");
const edcRoutes = require("./Routes/edc.routes.js");
const certificationRoutes = require("./Routes/certification.route.js");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
const http = require("http"); // Required for Socket.io
const socketIo = require("socket.io"); // Socket.io library
const chatbotRoutes = require("./Routes/chat.route.js");
const beneficiaireFileRoutes = require('./Routes/beneficiaireFileUpload.route');
const achatRoutes = require("./Routes/achat.route.js");
const encadrantRoutes = require("./Routes/encadrant.route.js");
const fabRoutes = require("./Routes/fab.route.js");
const formationBaseRoutes = require('./Routes/formationBase.route.js');
const formationFabRoutes = require('./Routes/formationFab.route.js');


dotenv.config();

// Initialiser l'application Express d'abord
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected");
  
  // Join a room based on user role and ID
  socket.on("join", (userData) => {
    const { userId, role } = userData;
    console.log(`User ${userId} with role ${role} joined`);
    
    // Join user-specific room
    socket.join(userId);
    
    // Store user info in socket
    socket.userId = userId;
    socket.userRole = role;
  });
  
  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Configuration de l'application
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    })
);

// Connexion à la base de données
connectDB();

// Configuration des dossiers d'uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration du stockage multer
const storage = multer.memoryStorage(); // Utilise memoryStorage au lieu de diskStorage

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 } // Limite augmentée à 200MB
});

// Routes d'API
app.use("/api/auth", Auth);
app.use("/api/formation", formationRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);
app.use("/api/coordinateurs", coordinateurRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/formateur", formateurRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/evenement", evenementRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/entity", entityRoutes); 
app.use("/api/user", userRoutes); 

app.use("/api/fabs", fabRoutes);
app.use("/api/encadrants", encadrantRoutes);
app.use("/api/formation-base", formationBaseRoutes);
app.use("/api/formation-fabs", formationFabRoutes);

app.use("/api/edc",edcRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/presence",Presence);
app.use("/api/certification", certificationRoutes);
app.use("/api/achat", achatRoutes);
// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Une erreur est survenue sur le serveur", message: process.env.NODE_ENV === 'development' ? err.message : undefined });
});
app.use('/api/beneficiaire-files', beneficiaireFileRoutes);

// Démarrage du serveur (using server instance instead of app for Socket.io)
server.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});