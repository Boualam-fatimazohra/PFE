const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const {
  createUtilisateurEntity,
  getAllUtilisateurEntities,
  getUtilisateurEntityById,
  getEntitiesByUser,
  getUsersByEntity,
  updateUtilisateurEntity,
  deleteUtilisateurEntity
} = require("../Controllers/utilisateurEntity.controller");

// Create a new User-Entity association (protected: Admin only)
router.post(
  "/",
  authenticated,
  authorizeRoles("Admin"),
  createUtilisateurEntity
);

// Get all User-Entity associations (protected: Admin only)
router.get(
  "/",
  authenticated,
  authorizeRoles("Admin"),
  getAllUtilisateurEntities
);

// Get a specific User-Entity association by ID (protected: Admin only)
router.get(
  "/:id",
  authenticated,
  authorizeRoles("Admin"),
  getUtilisateurEntityById
);

// Get all entities associated with a specific user (protected: Admin, Manager)
router.get(
  "/user/:userId",
  authenticated,
  authorizeRoles("Admin", "Manager"),
  getEntitiesByUser
);

// Get all users associated with a specific entity (protected: Admin, Manager)
router.get(
  "/entity/:entityId",
  authenticated,
  authorizeRoles("Admin", "Manager"),
  getUsersByEntity
);

// Update a User-Entity association (protected: Admin only)
router.put(
  "/:id",
  authenticated,
  authorizeRoles("Admin"),
  updateUtilisateurEntity
);

// Delete a User-Entity association (protected: Admin only)
router.delete(
  "/:id",
  authenticated,
  authorizeRoles("Admin"),
  deleteUtilisateurEntity
);

module.exports = router;