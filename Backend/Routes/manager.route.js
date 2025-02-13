const express = require("express");
const router = express.Router();
const {
    createManager,
    getManagers,
    getManagerById,
    updateManager,
    deleteManager
} = require("../Controllers/manager.controller");

// TODO:------------>Alert: to be modified so no other users can create/update/delete manager
// Create a new Manager sample
router.post("/", createManager);

// Get all Managers
router.get("/", getManagers);

// Get a Manager by ID
router.get("/:id", getManagerById);

// Update a Manager
router.put("/:id", updateManager);

// Delete a Manager
router.delete("/:id", deleteManager);

module.exports = router;
