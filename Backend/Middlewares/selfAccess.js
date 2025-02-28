const Manager = require("../Models/manager.model");
const Formateur = require("../Models/formateur.model");
const Coordinateur = require("../Models/coordinateur.model");

const authorizeSelfGetUpdate = async (req, res, next) => {
    const { id } = req.params; // ID from request (Manager/Formateur/Coordinateur ID)
    const { role, userId } = req.user; // Extracted from JWT in cookie

    // Admin can access any profile
    if (role === "Admin") {
        return next();
    }
    
    try {
        let userEntity = null;

        // Check user role and fetch corresponding entity
        if (role === "Manager") {
            userEntity = await Manager.findById(id).populate("utilisateur");
        } else if (role === "Formateur") {
            userEntity = await Formateur.findById(id).populate("utilisateur");
        } else if (role === "Coordinateur") {
            userEntity = await Coordinateur.findById(id).populate("utilisateur");
        }

        if (!userEntity) {
            return res.status(404).json({ message: "Entity not found" });
        }

        const utilisateurId = String(userEntity.utilisateur._id); // Convert to string for comparison

        // Ensure the user can only access their own profile
        if (utilisateurId !== String(userId)) {
            return res.status(403).json({ message: "Forbidden: You can only access or update your own profile" });
        }

        next();
    } catch (error) {
        console.error("Error in authorization middleware:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = authorizeSelfGetUpdate;