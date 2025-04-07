const express = require("express");
const {
  createCoordinateur,
  getAllCoordinateurs,
  getCoordinateurById,
  updateCoordinateur,
  deleteCoordinateur
} = require("../Controllers/coordinateur.controller");
const authenticated=require("../Middlewares/Authmiddleware.js");
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const router = express.Router();
// Create a new Coordinateur
router.post("/",authenticated,authorizeRoles("Admin"),createCoordinateur);

// Get all Coordinateurs
router.get("/", authenticated,authorizeRoles("Manager"),getAllCoordinateurs);

// Get a single Coordinateur by ID
router.get("/:id", authenticated,authorizeRoles("Manager"),getCoordinateurById);

// Update a Coordinateur
router.put("/:id",authenticated,authorizeRoles("Manager"), updateCoordinateur);

// Delete a Coordinateur
router.delete("/:id", authenticated,authorizeRoles("Manager"),deleteCoordinateur);

module.exports = router;
