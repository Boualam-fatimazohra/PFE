const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/config.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

// Import services
const { configureSocketIO } = require("./services/socketService");
const { initializeUploadsDirectory } = require("./services/upload/uploadService");

// Import routes
const Auth = require("./Routes/auth.route.js");
const formationRoutes = require("./Routes/formation.route.js");
const formateurRoutes = require("./Routes/formateur.route.js");
const beneficiaireRoutes = require("./Routes/beneficiaire.route.js");
const coordinateurRoutes = require("./Routes/coordinateur.route.js");
const managerRoutes = require("./Routes/manager.route.js");
const evaluationRoutes = require("./Routes/evaluation.route.js");
const evenementRoutes = require("./Routes/evenement.route.js");
const notificationRoutes = require("./Routes/notification.route.js");
const chatRoutes = require("./Routes/chat.route.js");
const uploadRoutes = require("./Routes/upload/upload.route.js");
const beneficiaireFileRoutes = require('./Routes/beneficiaireFileUpload.route');

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize and configure Socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Configure Socket.io with our service
configureSocketIO(io);

// Make io accessible to routes
app.set('io', io);

// App configuration
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

// Connect to database
connectDB();

// Setup uploads directory and static route
const uploadsDir = initializeUploadsDirectory();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", Auth);
app.use("/api/formation", formationRoutes);
app.use("/api/beneficiaires", beneficiaireRoutes);
app.use("/api/coordinateurs", coordinateurRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/formateur", formateurRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/evenement", evenementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/beneficiaire-files', beneficiaireFileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ 
        error: "Une erreur est survenue sur le serveur", 
        message: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});