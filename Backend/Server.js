const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js');
const formateurRoute = require('./Routes/formateur.route.js');

const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080", // Use environment variable for client URL
    credentials: true,
  })
);

// Connect to the database before starting the server
connectDB().then(() => {
  // Routes
  app.use('/api/auth', Auth);
  app.use('/api/formateur', formateurRoute);

  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to the database:", error);
  process.exit(1); // Stop the server if the DB connection fails
});
