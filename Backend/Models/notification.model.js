// Update your notification.model.js
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
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  },
  response: {
    type: String,
    default: ""
  },
  relatedTo: {
    model: {
      type: String,
      enum: ["Formation", "Beneficiaire", "Formateur", "Notification"],
      required: false,
      default: "Notification" 
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);