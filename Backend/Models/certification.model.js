const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    formation: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Formation",
        required: true 
    },
    beneficiaires: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Beneficiaire",
            validate: {
                validator: function(value) {
                    return Array.isArray(value) && value.every(item => mongoose.Types.ObjectId.isValid(item));
                },
                message: 'Each beneficiaire must be a valid ObjectId reference.'
            }
        }
    ]
}, { timestamps: true });

const Certification = mongoose.model("Certification", certificationSchema);

module.exports = Certification;
