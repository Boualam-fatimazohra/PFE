const express = require("express");
const router = express.Router();
const entityController = require("../Controllers/entity.controller");
const authorizeRoles = require('../Middlewares/RoleMiddleware.js');
const authenticated = require('../Middlewares/Authmiddleware.js');


router.post("/Addentity",authenticated, 
                        authorizeRoles('Admin'),
                        entityController.createEntity); 

router.get("/getEntities",authenticated, 
                        authorizeRoles('Admin'), 
                        entityController.getAllEntities); 

router.get("/getEntityById/:id",authenticated, 
                                authorizeRoles('Admin'), 
                                entityController.getEntityById); 

router.put("/updateEntity/:id",authenticated, 
                                authorizeRoles('Admin'), 
                                entityController.updateEntity); 

router.delete("/deleteEntity/:id", authenticated, 
                                authorizeRoles('Admin'), 
                                entityController.deleteEntity); 

module.exports = router;