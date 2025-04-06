const mongoose = require('mongoose');
const achatSchema = new mongoose.Schema({
    idCoordinateur: { ref: "Coordinateur", type: mongoose.Schema.Types.ObjectId, required: true },
    etatDemandeAchat: { type: String, required: true, enum: ["Validation sm", "Direction"] },
    etatBonCommande: { type: String, required: true, enum: ["En cours de référencement", "En cours de signature", "signé"] },
    dateCreation: { type: Date, required: true },
    etatPrestation: { type: String, required: true, enum: ["teste"] },
    etatPVR: { type: String, required: true, enum: ["test"] },
    datePrevuePaiement: { type: Date, required: true },
    etatPaiement: { type: String, required: true, enum: ["test"] },
    affectation: { type: String, required: true, enum: ["test"] },
    
    associationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    associationType:{ 
        type: String, 
        required: true, 
        enum: ["Formation","Evenement", "Entity"]
    }
}, { timestamps: true });

achatSchema.methods.getAssociation = async function() {
    let Model;
    switch (this.associationType) {
        case 'Formation':
            Model = mongoose.model('Formation');
            break;
        case 'Evenement':
            Model = mongoose.model('Evenement');
            break;
        case 'Entity':
            Model = mongoose.model('Entity');
            break;
    }
    
    if (Model) {
        return await Model.findById(this.associationId);
    }
    return null;
};

module.exports = mongoose.model("Achat", achatSchema);