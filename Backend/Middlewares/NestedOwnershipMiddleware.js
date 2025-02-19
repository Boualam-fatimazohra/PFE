const mongoose = require('mongoose');

const authorizeNestedOwnership = (model, relationPath) => {
    return async (req, res, next) => {
        try {
            const { userId, role } = req.user;
            const { id } = req.params;

            // Admin bypass
            if (role === "Admin") {
                return next();
            }

            const Model = mongoose.models[model];
            
            // Get entity and populate the relation path
            const entity = await Model.findById(id).populate(relationPath);
            
            if (!entity) {
                return res.status(404).json({ message: `${model} not found` });
            }

            // Get nested user ID using the relation path
            const pathParts = relationPath.split('.');
            let currentValue = entity;
            
            for (const part of pathParts) {
                currentValue = currentValue[part];
                if (!currentValue) {
                    return res.status(403).json({ message: "Invalid relationship path" });
                }
            }

            // Compare with logged-in user's ID
            if (currentValue.toString() !== userId) {
                return res.status(403).json({ message: `Forbidden: You do not have permission to access this ${model}` });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = authorizeNestedOwnership;