const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../Models/utilisateur.model.js');

const authenticated = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("un token existe dans les cookies",token);
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.userId);
        const user = await Utilisateur.findById(decoded.userId);
        if (!user) {
            console.log("User no longer exists");
            res.clearCookie('token');
            return res.status(401).json({ message: 'User no longer exists' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.clearCookie('token');
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}; 
exports.isManager = (req, res, next) => {
    if (req.user.role !== "Manager") {
      return res.status(403).json({ message: "Only managers can perform this action" });
    }
    next();
  };
  
  exports.isCoordinateur = (req, res, next) => {
    if (req.user.role !== "Coordinateur") {
      return res.status(403).json({ message: "Only Coordinateurs can perform this action" });
    }
    next();
  };

  exports.isFormateur = (req, res, next) => {
    if (req.user.role !== "Formateur") {
      return res.status(403).json({ message: "Only Formateurs can perform this action" });
    }
    next();};
module.exports = authenticated;