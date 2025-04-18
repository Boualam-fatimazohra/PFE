const express = require("express");
const router = express.Router();
const {
  createBeneficiaire,
  getAllBeneficiaires,
  getBeneficiaireById,
  updateBeneficiaire,
  deleteBeneficiaire,
  uploadBeneficiairesFromExcel,
  getBeneficiaireFormation,
  getNombreBeneficiairesParFormateur,
  updateBeneficiaireConfirmations,
  exportBeneficiairesToExcel,
  getBeneficiairesWithPresence,
  exportBeneficiairesListToExcel,
  updateReglementStatus
} = require("../Controllers/beneficiaire.controller");
const upload = require("../utils/upload");
const authenticated = require("../Middlewares/Authmiddleware.js");
const RoleMiddleware = require("../Middlewares/RoleMiddleware.js");
const authorizeFormationAccess=require("../Middlewares/FormationAccess.js");
const { generateAndSendQRCode,verifyQRCode } = require("../Controllers/qrcode.controller.js");

// get nombre beneficiaires par formateur
router.get("/getNbrBeneficiairesParFormateur",authenticated,RoleMiddleware("Formateur"), getNombreBeneficiairesParFormateur);

// Get Benef for formateur
router.get("/getNbrBeneficiairesParFormateur",
  authenticated,
  RoleMiddleware("Formateur"), 
  getNombreBeneficiairesParFormateur
);


// upload benef data from excel
router.post("/upload", upload.single("file"), uploadBeneficiairesFromExcel);

// Route to create a new Beneficiaire (Must be associated with a Formation)
// router.post("/", createBeneficiaire);
router.post('/createBeneficiaire', 
  createBeneficiaire
);

// Route to get all Beneficiaires (with Formation details)
router.get("/", 
  getAllBeneficiaires
);

// Get benef By formation ID
router.get("/getBeneficiaireByFormation/:id",
  authenticated,RoleMiddleware("Formateur"),
  authorizeFormationAccess("read"),
  getBeneficiaireFormation);

// Route to delete a Beneficiaire
router.delete("/deleteAll", 
  deleteBeneficiaire
);

// route pour modifier les confirmations des beneficiares par le formateur  (téléphone et  email) , 
// pour l'id qui est passé dans la route il s'agit de l'id de la formation utilisé dans authorizeFormationAccess pour vérifier est ce que cette formation
// appartient au formateur qui fait la requête
router.post("/updateConfirmationBeneficiaire/:id",
  authenticated,RoleMiddleware("Formateur"),
  authorizeFormationAccess("update"),
  updateBeneficiaireConfirmations
);

// Route pour exporter les bénéficiaires d'une formation en Excel
router.get("/export/:formationId", 
  authenticated, 
  RoleMiddleware("Admin", "Manager", "Formateur"), 
  exportBeneficiairesToExcel
);

router.post("/sendQRCode",generateAndSendQRCode);
router.post("/verifyQRCode",verifyQRCode);


router.get("/getBeneficiairesWithPresence/:formationId",
  authenticated,
  getBeneficiairesWithPresence
);

// Route to update règlement intérieur status for multiple beneficiaires
router.put(
  '/reglement-status',
  authenticated,
  RoleMiddleware('Admin', 'Manager', 'Formateur'),
  updateReglementStatus
);

// Test route for debugging
router.put('/reglement-status-test', (req, res) => {
  try {
    res.status(200).json({
      message: "Test successful",
      received: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/uploadList", 
  upload.single("file"),
  exportBeneficiairesListToExcel
);

// Route to get a single Beneficiaire by ID (with Formation details)
router.get("/:id", 
  getBeneficiaireById
);

// Route to update a Beneficiaire
router.put("/:id",
  authenticated,
  RoleMiddleware("Formateur"),
  updateBeneficiaire
);



module.exports = router;
