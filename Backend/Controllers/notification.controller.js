const Notification = require("../Models/notification.model");
const Formateur = require("../Models/formateur.model");
const { Utilisateur } = require("../Models/utilisateur.model");

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { type, entityId, receiverId } = req.body;
    const senderId = req.user.userId;

    // Validate required fields
    if (!type || !entityId || !receiverId) {
      return res.status(400).json({ message: "Type, entityId and receiver are required" });
    }

    // Validate type enum
    if (!["formation", "evenement"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'formation' or 'evenement'" });
    }

    // Check if receiver exists
    const receiverExists = await Utilisateur.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Create new notification
    const notification = new Notification({
      sender: senderId,
      receiver: receiverId,
      type,
      entityId,
      status: "pending"
    });

    // Save notification
    await notification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(receiverId).emit('notification', {
      _id: notification._id,
      sender: senderId,
      type: notification.type,
      entityId: notification.entityId,
      createdAt: notification.createdAt
    });

    res.status(201).json({
      message: "Notification sent successfully",
      notification
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};

// Send notification from formateur to manager
const sendNotificationToManager = async (req, res) => {
  try {
    const formateurId = req.user.userId;
    const { type, entityId } = req.body;

    // Validate required fields
    if (!type || !entityId) {
      return res.status(400).json({ message: "Type and entityId are required" });
    }

    // Validate type enum
    if (!["formation", "evenement"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'formation' or 'evenement'" });
    }

    // Find formateur to get manager
    const formateur = await Formateur.findOne({ utilisateur: formateurId }).populate("manager");
    
    if (!formateur) {
      return res.status(404).json({ message: "Formateur not found" });
    }
    
    if (!formateur.manager) {
      return res.status(404).json({ message: "Manager not assigned to this formateur" });
    }

    // Get manager's utilisateur ID
    const managerUser = await Utilisateur.findById(formateur.manager.utilisateur);
    if (!managerUser) {
      return res.status(404).json({ message: "Manager user not found" });
    }

    // Create notification
    const notification = new Notification({
      sender: formateurId,
      receiver: managerUser._id,
      type,
      entityId,
      status: "pending"
    });

    // Save notification
    await notification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(managerUser._id.toString()).emit('notification', {
      _id: notification._id,
      sender: formateurId,
      type: notification.type,
      entityId: notification.entityId,
      createdAt: notification.createdAt
    });

    res.status(201).json({
      message: "Notification sent to manager successfully",
      notification
    });
  } catch (error) {
    console.error("Error sending notification to manager:", error);
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find notifications where user is the receiver
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "nom prenom")
      .sort({ createdAt: -1 });
      
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Find and update notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, receiver: userId },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not authorized" });
    }
    
    res.status(200).json({
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error updating notification", error: error.message });
  }
};

// Process notification (accept or decline)
const processNotification = async (req, res) => {
  try {
    console.log("Notification Updated Status");
    console.log("Notification Status:", req.body.status);
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'declined'" });
    }

    // Find notification and check if user is the receiver
    const notification = await Notification.findOne({ 
      _id: id, 
      receiver: userId
    }).populate("sender");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not authorized" });
    }

    // Update notification status
    notification.status = status;
    notification.isRead = true;
    await notification.save();
    console.log("Updated Status: ", notification.status);
    // Create response notification for the sender
    const responseNotification = new Notification({
      sender: userId,
      receiver: notification.sender._id,
      type: notification.type,
      entityId: notification.entityId,
      status: "pending"
    });

    await responseNotification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(notification.sender._id.toString()).emit('notification', {
      _id: responseNotification._id,
      sender: userId,
      type: responseNotification.type,
      entityId: responseNotification.entityId,
      status: status,
      createdAt: responseNotification.createdAt
    });

    res.status(200).json({
      message: `Notification ${status}`,
      notification
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    res.status(500).json({ message: "Error processing notification", error: error.message });
  }
};

module.exports = {
  createNotification,
  sendNotificationToManager,
  getUserNotifications,
  markNotificationAsRead,
  processNotification
};