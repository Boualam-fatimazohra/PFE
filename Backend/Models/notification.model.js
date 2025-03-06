const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Utilisateur", 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Utilisateur", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String, 
    enum: ["message", "alert", "info"],
    default: "message"
  },
  relatedTo: {
    model: {
      type: String,
      enum: ["Formation", "Beneficiaire", "Formateur"],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);