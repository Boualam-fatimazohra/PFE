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
  isRead: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String, 
    enum: ["formation", "evenement"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);