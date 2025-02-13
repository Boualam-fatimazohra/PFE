const express = require("express");
const {
  createCoordinateur,
  getAllCoordinateurs,
  getCoordinateurById,
  updateCoordinateur,
  deleteCoordinateur
} = require("../Controllers/coordinateur.controller");

const router = express.Router();

// Create a new Coordinateur
router.post("/", createCoordinateur);

// Get all Coordinateurs
router.get("/", getAllCoordinateurs);

// Get a single Coordinateur by ID
router.get("/:id", getCoordinateurById);

// Update a Coordinateur
router.put("/:id", updateCoordinateur);

// Delete a Coordinateur
router.delete("/:id", deleteCoordinateur);

module.exports = router;
