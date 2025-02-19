const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authoriezeRoles = require('../Middlewares/RoleMiddleware.js');
const authorizeSelfGetUpdate = require('../Middlewares/selfAccess.js');
const {
    createManager,
    getManagers,
    getManagerById,
    updateManager,
    deleteManager
} = require("../Controllers/manager.controller");

// TODO:------------>Alert: to be modified so no other users can create/update/delete manager
// Create a new Manager sample
router.post("/",authenticated,authoriezeRoles('Admin'), createManager);
router.get("/",authenticated,authoriezeRoles('Admin'), getManagers);
// todo : il faut ajouter un middelware pour vérifier est ce que l'id de manager dans req et le meme que l'id passé en paramétre 
router.get("/:id",authenticated,authoriezeRoles('Admin',"Manager"), authorizeSelfGetUpdate, getManagerById);
router.put("/:id",authenticated,authoriezeRoles('Admin',"Manager"), authorizeSelfGetUpdate, updateManager);
router.delete("/:id",authenticated,authoriezeRoles('Admin'), deleteManager);

module.exports = router;
