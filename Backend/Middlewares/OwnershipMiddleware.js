const mongoose = require("mongoose");

const authorizeOwnership = (childModel, parentField) => {
    return async (req, res, next) => {
        try {
            const { userId, role } = req.user;
            const { id } = req.params;
            console.log("user Role: " + role + ",userId: " + userId);
            console.log("parms Id: " + id);

            if (role === "Admin") {
                return next();
            }

            const modelName = typeof childModel === 'function' ? childModel.modelName : childModel;
            
            const Model = mongoose.models[modelName];
            if (!Model) {
                console.error(`Model ${modelName} not found in registered models`);
                return res.status(500).json({ 
                    message: "Configuration error: Model not found",
                    debug: {
                        requestedModel: modelName,
                        availableModels: Object.keys(mongoose.models)
                    }
                });
            }

            // First, get the entity and populate only the necessary first level
            const childEntity = await Model.findById(id).populate('utilisateur').populate(parentField);

            if (!childEntity) {
                return res.status(404).json({ message: `${modelName}/:${id} not found` });
            }

            // Case 1: User is trying to access their own resource
            if (childEntity.utilisateur?._id.toString() === userId) {
                console.log("Access granted: User accessing own resource");
                return next();
            }

            // Case 2: No parent field (manager) assigned
            if (!childEntity[parentField]) {
                return res.status(403).json({ 
                    message: `Forbidden: No ${parentField} assigned to this ${modelName}` 
                });
            }

            // Case 3: Check if user is the manager
            // Handle both possible schema structures
            const parentUserId = childEntity[parentField].utilisateur?._id || 
                               childEntity[parentField].utilisateur;

            if (!parentUserId) {
                return res.status(403).json({ 
                    message: `Forbidden: Invalid ${parentField} configuration` 
                });
            }

            if (parentUserId.toString() === userId) {
                console.log(`Access granted: User is the ${parentField}`);
                return next();
            }

            return res.status(403).json({ 
                message: `Forbidden: You do not have permission to access this ${modelName}` 
            });

        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ 
                message: "Internal server error",
                error: error.message 
            });
        }
    };
};

module.exports = authorizeOwnership;