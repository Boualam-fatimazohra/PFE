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
const {multerUpload} =require('../Config/cloudinaryConfig.js');
const {exportRapportExcel,createRapport}=require("../Controllers/rapport.controller.js");

const router = express.Router();
// les routes fonctionnels jusqu'a present

// Create a new Coordinateur
router.post("/", 
   multerUpload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'imageCoordinateur', maxCount: 1 }
      ]),
  authenticated, 
  authorizeRoles('Admin', 'Manager'),
  createCoordinateur);

// Get all Coordinateurs
router.get("/", authenticated,authorizeRoles("Manager"),getAllCoordinateurs);

// Get a single Coordinateur by ID
router.get("/:id", authenticated,authorizeRoles("Manager"),getCoordinateurById);

// Update a Coordinateur
router.put("/:id",authenticated,multerUpload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'imageCoordinateur', maxCount: 1 }
]),
authenticated, 
authorizeRoles('Admin','Manager')
,updateCoordinateur);

// Delete a Coordinateur
router.delete("/:id", authenticated,authorizeRoles("Manager","Admin"),deleteCoordinateur);
router.post("/createRapport",createRapport);
router.post("/exportRapportExcel",exportRapportExcel);
module.exports = router;
