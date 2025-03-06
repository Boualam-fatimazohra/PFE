const Notification = require("../Models/notification.model");
const Formateur = require("../Models/formateur.model");
const { Utilisateur } = require("../Models/utilisateur.model");

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message, receiverId, type, relatedTo } = req.body;
    const senderId = req.user.userId;

    // Validate required fields
    if (!message || !receiverId) {
      return res.status(400).json({ message: "Message and receiver are required" });
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
      message,
      type: type || "message",
      relatedTo: relatedTo || null
    });

    // Save notification
    await notification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(receiverId).emit('notification', {
      _id: notification._id,
      sender: senderId,
      message,
      type: notification.type,
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
    const { message, type, relatedTo } = req.body;

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
      message,
      type: type || "message",
      relatedTo: relatedTo || null
    });

    // Save notification
    await notification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(managerUser._id.toString()).emit('notification', {
      _id: notification._id,
      sender: formateurId,
      message,
      type: notification.type,
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

// Add to notification.controller.js
const processNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
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
    notification.response = response || "";
    notification.isRead = true;
    await notification.save();

    // Create response notification for the sender
    const responseMessage = status === 'accepted' 
      ? `Votre demande a été acceptée: ${response || ''}`
      : `Votre demande a été refusée: ${response || ''}`;

    const responseNotification = new Notification({
      sender: userId,
      receiver: notification.sender._id,
      message: responseMessage,
      type: status === 'accepted' ? 'info' : 'alert',
      status: 'pending', // No need for the sender to respond to this
      relatedTo: {
        id: notification._id // No need to specify `model`, as it defaults to "Notification"
      }    });

    await responseNotification.save();

    // Send real-time notification via Socket.io
    const io = req.app.get('io');
    io.to(notification.sender._id.toString()).emit('notification', {
      _id: responseNotification._id,
      sender: userId,
      message: responseMessage,
      type: responseNotification.type,
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