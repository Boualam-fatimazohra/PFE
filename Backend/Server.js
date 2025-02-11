const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
 const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js');
const formateurRoute = require('./Routes/formateur.route.js');

const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
console.log()
// Middleware --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Connect to the database
  

app.use('/api/auth',Auth);
app.use('/api/formateur',formateurRoute);



// Start server
app.listen(PORT, () => {
  connectDB();

  console.log(`Server is running on port ${PORT}`);
});
