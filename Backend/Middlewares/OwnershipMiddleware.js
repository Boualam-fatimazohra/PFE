const mongoose = require("mongoose");

const authorizeOwnership = (childModel, parentField) => {
    return async (req, res, next) => {
        try {
            const { userId, role } = req.user;
            const { id } = req.params;
            console.log("user Role: " + role + ",userId: " + userId);
            console.log("parms Id: " + id);
            console.log('Middleware debug info:');
            console.log('childModel received:', childModel);
            console.log('Available models:', Object.keys(mongoose.models));

            if (role === "Admin") {
                return next();
            }

            // Ensure childModel is a string
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

            const childEntity = await Model.findById(id);
            if (!childEntity) {
                return res.status(404).json({ message: `${modelName}/:${id} not found` });
            }

            // if the formateur who want to get update himself (exemple)
            if (childEntity.utilisateur.toString() === userId) {
                console.log("middleware update yourself")
                return next();
            }

            // check if it's the manager of the formateur (exemple)
            if (childEntity[parentField].toString() !== userId) {
                return res.status(403).json({ message: `Forbidden: You do not have permission to access this ${modelName}` });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = authorizeOwnership;