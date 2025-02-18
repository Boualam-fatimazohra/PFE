const mongoose = require("mongoose");

const authorizeOwnership = (childModel, parentField) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId; // Extract user info from authentication middleware
            const { id } = req.params; // Extract entity ID from request parameters 

            // Find the child entity by ID (e.g., Formateur or Formation)
            const childEntity = await mongoose.model(childModel).findOne({ utilisateur: userId });
            if (!childEntity) {
                return res.status(404).json({ message: `${childModel} not found` });
            }

            // If the authenticated user is directly related to this entity (e.g., a Formateur updating their own record)
            if (childEntity._id.toString() === id) {
                return next();
            }

            // Check if the authenticated user is the assigned parent entity
            if (childEntity[parentField].toString() !== userId) {
                return res.status(403).json({ message: `Forbidden: You do not have permission to access this ${childModel}` });
            }

            // Everything is fine, proceed
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = authorizeOwnership;
