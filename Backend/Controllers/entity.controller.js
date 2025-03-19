// controllers/entityController.js
const { Entity } = require("../Models/entity.model");

// Créer une nouvelle entité
exports.createEntity = async (req, res) => {
    try {
        const { ville, type } = req.body;
        const newEntity = new Entity({ ville, type });
        await newEntity.save();
        res.status(201).json(newEntity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lire toutes les entités
exports.getAllEntities = async (req, res) => {
    try {
        const entities = await Entity.find();
        res.status(200).json(entities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lire une entité par son ID
exports.getEntityById = async (req, res) => {
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).json({ message: "Entité non trouvée" });
        }
        res.status(200).json(entity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une entité
exports.updateEntity = async (req, res) => {
    try {
        const { ville, type } = req.body;
        const updatedEntity = await Entity.findByIdAndUpdate(
            req.params.id,
            { ville, type },
            { new: true }
        );
        if (!updatedEntity) {
            return res.status(404).json({ message: "Entité non trouvée" });
        }
        res.status(200).json(updatedEntity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteEntity = async (req, res) => {
    try {
        const deletedEntity = await Entity.findByIdAndDelete(req.params.id);
        if (!deletedEntity) {
            return res.status(404).json({ message: "Entité non trouvée" });
        }
        res.status(200).json({ message: "Entité supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};