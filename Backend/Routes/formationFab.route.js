const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const upload = require('../Middlewares/uploadMiddleware');

const {
  createFormationFab,
  getAllFormationFabs,
  getFormationFabById,
  updateFormationFab,
  deleteFormationFab,
  getFormationFabsByStatus,
  getFormationFabsByCategory,
  getFormationFabsByLevel
} = require("../Controllers/formationFab.controller");

/**
 * @route POST /api/formation-fabs
 * @desc Create a new FormationFab
 * @access Private - Admin, Manager
 */
router.post(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'), 
  upload.single("image"),
  createFormationFab
);

/**
 * @route GET /api/formation-fabs
 * @desc Get all FormationFabs
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getAllFormationFabs
);

/**
 * @route GET /api/formation-fabs/:id
 * @desc Get a FormationFab by ID
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getFormationFabById
);

/**
 * @route PUT /api/formation-fabs/:id
 * @desc Update a FormationFab
 * @access Private - Admin, Manager
 */
router.put(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  upload.single("image"),
  updateFormationFab
);

/**
 * @route DELETE /api/formation-fabs/:id
 * @desc Delete a FormationFab
 * @access Private - Admin only
 */
router.delete(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin'),
  deleteFormationFab
);

/**
 * @route GET /api/formation-fabs/status/:status
 * @desc Get FormationFabs by status
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/status/:status", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getFormationFabsByStatus
);

/**
 * @route GET /api/formation-fabs/categorie/:categorie
 * @desc Get FormationFabs by category
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/categorie/:categorie", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getFormationFabsByCategory
);

/**
 * @route GET /api/formation-fabs/niveau/:niveau
 * @desc Get FormationFabs by level
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/niveau/:niveau", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur', 'Coordinateur'),
  getFormationFabsByLevel
);

module.exports = router;