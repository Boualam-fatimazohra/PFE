const express = require('express');
const {Login ,createUser,Logout} = require('../Controllers/Auth');

// const authenticated = require('../Middlewares/Authmiddleware')
// const verifyRole = require('../Middlewares/verifyRole')
const router = express.Router();

router.post('/signIn', Login);
router.post('/signup',createUser);
router.get('/logout', Logout);

// router.get('/validate-token', authenticated, verifyRole(['Mentor']), (req, res) => {
//     res.status(200).json({ message: 'Token is valid.', user: req.user });
// });

// router.get('/verifier_admin', authenticated, verifyRole(['Admin']), (req, res) => {
//   res.status(200).json({ message: 'Welcome to the admin dashboard' , user: req.user });
// });



module.exports = router;