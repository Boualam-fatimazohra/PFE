const express = require("express");
const router = express.Router();
const authenticated = require('../Middlewares/Authmiddleware.js');
const authoriezeRoles = require('../Middlewares/RoleMiddleware.js');
const authorizeSelfGetUpdate = require('../Middlewares/selfAccess.js');
const authorizeOwnership = require('../Middlewares/OwnershipMiddleware.js');

const {
    createManager,
    getManagers,
    getManagerById,
    updateManager,
    deleteManager,
    // getManagerStatistique
} = require("../Controllers/manager.controller");

// Create a new Manager
router.post("/",
    authenticated,
    authoriezeRoles('Admin'), 
    createManager
);
router.get("/",
    authenticated,
    authoriezeRoles('Admin',"Manager"), 
    getManagers
);

router.get("/:id",
    authenticated,
    authoriezeRoles('Admin',"Manager"), 
    authorizeOwnership('Manager', "utilisateur"), 
    getManagerById
);
router.put("/:id",
    authenticated,
    authoriezeRoles('Admin',"Manager"), 
    authorizeOwnership('Manager', "utilisateur"), 
    updateManager
);
router.delete("/:id",
    authenticated,
    authoriezeRoles('Admin'), 
    deleteManager
);
// router.post("/getManagerStatistique",
//     authenticated,
//     authoriezeRoles("Manager"),
//     getManagerStatistique);

module.exports = router;
