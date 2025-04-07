const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const {
  createEncadrant,
  getAllEncadrants,
  getEncadrantById,
  updateEncadrant,
  deleteEncadrant
} = require("../Controllers/encadrant.controller");

// TODO------> Adjust Middleware (check Manager(Fab))

/**
 * @route POST /api/encadrants
 * @desc Create a new encadrant
 * @access Private - Admin, Manager
 */
router.post(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'), 
  createEncadrant
);

/**
 * @route GET /api/encadrants
 * @desc Get all encadrants
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getAllEncadrants
);

/**
 * @route GET /api/encadrants/:id
 * @desc Get encadrant by ID
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getEncadrantById
);

/**
 * @route PUT /api/encadrants/:id
 * @desc Update an encadrant
 * @access Private - Admin, Manager
 */
router.put(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  updateEncadrant
);

/**
 * @route DELETE /api/encadrants/:id
 * @desc Delete an encadrant
 * @access Private - Admin only
 */
router.delete(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin'),
  deleteEncadrant
);

module.exports = router;