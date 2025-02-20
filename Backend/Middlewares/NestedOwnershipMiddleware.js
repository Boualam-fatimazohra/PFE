const mongoose = require('mongoose');

const authorizeNestedOwnership = (model, relationPaths) => {
    return async (req, res, next) => {
        try {
            const { userId, role } = req.user;

            // Admin bypass
            if (role === "Admin") {
                return next();
            }

            const Model = mongoose.models[model];
            
            // Handle the case where there's no specific resource ID (like in GetFormationOfMentor)
            if (!req.params.id) {
                // If no ID is provided, we're likely dealing with a list endpoint
                return next();
            }

            // Get entity and populate all relation paths
            const entity = await Model.findById(req.params.id)
                .populate(Array.isArray(relationPaths) 
                    ? relationPaths.join(' ') 
                    : relationPaths);

            if (!entity) {
                return res.status(404).json({ message: `${model} not found` });
            }

            // If relationPaths is a string, convert it to array for consistent handling
            const paths = Array.isArray(relationPaths) ? relationPaths : [relationPaths];

            // Check each path until we find a match
            let hasAccess = false;
            for (const path of paths) {
                const pathParts = path.split('.');
                let currentValue = entity;

                // Navigate through the path
                for (const part of pathParts) {
                    currentValue = currentValue[part];
                    if (!currentValue) break;
                }

                // If we found a matching user ID in any path, grant access
                if (currentValue && currentValue.toString() === userId) {
                    hasAccess = true;
                    break;
                }
            }

            if (!hasAccess) {
                return res.status(403).json({ 
                    message: `Forbidden: You do not have permission to access this ${model}` 
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = authorizeNestedOwnership;