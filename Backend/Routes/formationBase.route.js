const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const { uploadFormationFabImage } = require('../Config/cloudinaryConfig.js');
const authorizeRoleAndEntity = require('../Middlewares/authorizeRoleAndEntityMiddleware.js');
 
const {
  createFormationBase,
  getAllFormationBases,
  getFormationBaseById,
  updateFormationBase,
  deleteFormationBase,
  addEncadrantToFormation,
  removeEncadrantFromFormation,
} = require("../Controllers/formationBase.controller");

/**
 * @route POST /api/formation-base
 * @desc Create a new formation base
 * @access Private - Admin, Manager
 */
router.post(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  authorizeRoleAndEntity('Manager', 'Fab'),
  uploadFormationFabImage.single("image"),
  createFormationBase
);

/**
 * @route GET /api/formation-base
 * @desc Get all formation bases
 * @access Private - Admin, Manager, Formateur
 */
router.get(
  "/", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur'),
  getAllFormationBases
);

/**
 * @route GET /api/formation-base/:id
 * @desc Get a formation base by ID
 * @access Private - Admin, Manager, Formateur, Coordinateur, Encadrant
 */
router.get(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager', 'Formateur'),
  getFormationBaseById
);

/**
 * @route PUT /api/formation-base/:id
 * @desc Update a formation base
 * @access Private - Admin, Manager
 */
router.put(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  uploadFormationFabImage.single("image"),
  updateFormationBase
);

/**
 * @route DELETE /api/formation-base/:id
 * @desc Delete a formation base
 * @access Private - Admin only
 */
router.delete(
  "/:id", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  deleteFormationBase
);

/**
 * @route POST /api/formation-base/add-encadrant
 * @desc Add an encadrant to a formation
 * @access Private - Admin, Manager
 */
router.post(
  "/add-encadrant", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  addEncadrantToFormation
);

/**
 * @route DELETE /api/formation-base/:formationId/encadrant/:encadrantId
 * @desc Remove an encadrant from a formation
 * @access Private - Admin, Manager
 */
router.delete(
  "/:formationId/encadrant/:encadrantId", 
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  removeEncadrantFromFormation
);

module.exports = router;