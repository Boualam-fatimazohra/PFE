const crypto =require("crypto")
const generateToken = () => {
    return crypto.randomBytes(16).toString("hex"); // Génère un token de 32 caractères hexadécimaux
  };
  
  module.exports = generateToken;
    