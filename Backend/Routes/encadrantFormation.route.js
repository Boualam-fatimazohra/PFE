const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');

const {
  assignEncadrantToFormation,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getFormationsByEncadrant,
  getEncadrantsByFormation,
  listFormationsWithEncadrants
} = require("../Controllers/encadrantFormation.controller");

/**
 * @route POST /api/encadrant-formations
 * @desc Assign an encadrant to a formation
 * @access Private - Admin, Manager
 */
router.post(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  assignEncadrantToFormation
);

/**
 * @route GET /api/encadrant-formations
 * @desc Get all assignments
 * @access Private - Admin, Manager, Formateur, Coordinateur
 */
/*router.get(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getAllAssignments
);*/
router.get(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  listFormationsWithEncadrants
);

/**
 * @route GET /api/encadrant-formations/:id
 * @desc Get an assignment by ID
 * @access Private - Admin, Manager, Formateur, Coordinateur
 */
router.get(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getAssignmentById
);

/**
 * @route PUT /api/encadrant-formations/:id
 * @desc Update an assignment
 * @access Private - Admin, Manager
 */
router.put(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  updateAssignment
);

/**
 * @route DELETE /api/encadrant-formations/:id
 * @desc Delete an assignment
 * @access Private - Admin, Manager
 */
router.delete(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  deleteAssignment
);

/**
 * @route GET /api/encadrant-formations/encadrant/:encadrantId
 * @desc Get all formations for a specific encadrant
 * @access Private - Admin, Manager, Formateur, Coordinateur
 */
router.get(
  "/encadrant/:encadrantId", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getFormationsByEncadrant
);

/**
 * @route GET /api/encadrant-formations/formation/:formationId
 * @desc Get all encadrants for a specific formation
 * @access Private - Admin, Manager, Formateur, Coordinateur
 */
router.get(
  "/formation/:formationId", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getEncadrantsByFormation
);

module.exports = router;