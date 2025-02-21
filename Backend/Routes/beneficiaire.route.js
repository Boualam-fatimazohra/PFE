const express = require("express");
const router = express.Router();
const {
  createBeneficiaire,
  getAllBeneficiaires,
  getBeneficiaireById,
  updateBeneficiaire,
  deleteBeneficiaire,
  uploadBenificiaireExcel,
  uploadBeneficiairesFromExcel,
} = require("../Controllers/beneficiaire.controller");
const upload = require("../utils/upload");

router.post("/upload", upload.single("file"), uploadBeneficiairesFromExcel);

// Route to create a new Beneficiaire (Must be associated with a Formation)
// router.post("/", createBeneficiaire);
router.post('/createBeneficiaire', createBeneficiaire);
// Route to get all Beneficiaires (with Formation details)
router.get("/", getAllBeneficiaires);

// Route to get a single Beneficiaire by ID (with Formation details)
router.get("/:id", getBeneficiaireById);

// Route to update a Beneficiaire
router.put("/:id", updateBeneficiaire);

// Route to delete a Beneficiaire
router.delete("/deleteAll", deleteBeneficiaire);

module.exports = router;
