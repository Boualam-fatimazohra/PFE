const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authorizeRoleAndEntity = require('../Middlewares/authorizeRoleAndEntityMiddleware.js')

const {
  createFab,
  getAllFabs,
  getFabById,
  updateFab,
  deleteFab,
  getFabStats
} = require("../Controllers/fab.controller");

/**
 * @route POST /api/fabs
 * @desc Create a new Fab
 * @access Private - Admin only
 */
router.post(
  "/", 
  authenticated, 
  authorizeRoles('Admin'),
  createFab
);

/**
 * @route GET /api/fabs
 * @desc Get all Fabs
 * @access Private - Admin, Manager
 */
router.get(
  "/getFormationFab", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  getAllFabs
);

/**
 * @route GET /api/fabs/:id
 * @desc Get a Fab by ID
 * @access Private - Admin, Manager
 */
router.get(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  getFabById
);

/**
 * @route PUT /api/fabs/:id
 * @desc Update a Fab
 * @access Private - Admin only
 */
router.put(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin'),
  updateFab
);

/**
 * @route DELETE /api/fabs/:id
 * @desc Delete a Fab
 * @access Private - Admin only
 */
router.delete(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin'),
  deleteFab
);

/**
 * @route GET /api/fabs/:id/stats
 * @desc Get statistics for a specific Fab
 * @access Private - Admin, Manager
 */
router.get(
  "/stats/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  getFabStats
);

module.exports = router;