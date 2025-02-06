const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
// const connectDB = require('./Config/config.js');
// const Auth = require('./Routes/auth.js')
// const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// Connect to the database
// connectDB();


// app.use('/api/auth', Auth);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
