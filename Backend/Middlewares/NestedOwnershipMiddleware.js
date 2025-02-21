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
            
            if (!req.params.id) {
                return next();
            }

            // Convert relationPaths to array for consistent handling
            const paths = Array.isArray(relationPaths) ? relationPaths : [relationPaths];

            // Build populate object for all paths
            const populateOptions = paths.map(path => ({
                path: path.split('.')[0],
                populate: path.split('.').slice(1).reduce((acc, curr) => ({
                    path: curr,
                    populate: acc
                }), undefined)
            }));

            // Get entity and populate all paths
            const entity = await Model.findById(req.params.id)
                .populate(populateOptions);

            console.log('Found entity:', {
                id: entity?._id,
                model: model
            });

            if (!entity) {
                return res.status(404).json({ message: `${model} not found` });
            }

            // Check access through each path
            let hasAccess = false;
            for (const path of paths) {
                const pathParts = path.split('.');
                let currentValue = entity;

                // Navigate through the path
                for (const part of pathParts) {
                    if (!currentValue || typeof currentValue !== 'object') {
                        currentValue = undefined;
                        break;
                    }
                    currentValue = currentValue[part];
                }

                // Get the final ID value
                const finalId = currentValue?._id || currentValue;

                console.log('Checking permission for path:', {
                    path,
                    finalId: finalId?.toString(),
                    requestingUserId: userId,
                    match: finalId?.toString() === userId
                });

                if (finalId && finalId.toString() === userId) {
                    hasAccess = true;
                    break;
                }
            }

            if (hasAccess) {
                return next();
            }

            return res.status(403).json({ 
                message: `Forbidden: You do not have permission to access this ${model}` 
            });

        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = authorizeNestedOwnership;