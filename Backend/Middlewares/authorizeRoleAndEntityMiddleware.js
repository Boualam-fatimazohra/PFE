const mongoose = require('mongoose');
const { UtilisateurEntity } = require('../Models/utilisateurEntity.js');

/**
 * Middleware to authorize users based on both role and entity type
 * @param {string|Array<string>} allowedRoles - Role(s) allowed to access the route
 * @param {string|Array<string>} allowedEntities - Entity type(s) the user must be associated with
 * @returns {Function} Express middleware function
 */
const authorizeRoleAndEntity = (allowedRoles, allowedEntities) => {
  return async (req, res, next) => {
    try {
      // Get user info from auth middleware
      const { userId, role } = req.user;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Convert inputs to arrays for consistent handling
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      const entities = Array.isArray(allowedEntities) ? allowedEntities : [allowedEntities];

      // If "Admin" role, bypass entity check
      if (role === "Admin") {
        return next();
      }
      
      // Check role authorization first
      if (!roles.includes(role)) {
        return res.status(403).json({ 
          message: `Forbidden: Only ${roles.join(', ')} roles can access this resource, you role is: ${role}`
        });
      }

      // Check entity association
      const userEntityAssociations = await UtilisateurEntity.find({ id_utilisateur: userId })
        .populate('id_entity');
      
      if (!userEntityAssociations || userEntityAssociations.length === 0) {
        return res.status(403).json({ 
          message: "You are not associated with any entity" 
        });
      }

      // Check if user is associated with at least one of the allowed entities
      const hasAllowedEntity = userEntityAssociations.some(association => 
        entities.includes(association.id_entity.type)
      );

      if (!hasAllowedEntity) {
        return res.status(403).json({ 
          message: `Forbidden: You must be associated with a ${entities.join(' or ')} entity` 
        });
      }

      // All checks passed
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error during authorization" });
    }
  };
};

// Only allow Managers associated with Fab entities
//----> authorizeRoleAndEntity("Manager", "Fab"),

// Allow either Managers or Formateurs associated with either Fab or OFab entities
//----> authorizeRoleAndEntity(["Manager", "Formateur"], ["Fab", "OFab"]), 

module.exports = authorizeRoleAndEntity;