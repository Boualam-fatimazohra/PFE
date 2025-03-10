const express = require("express");
const router = express.Router();
const {
  createNotification,
  sendNotificationToManager,
  getUserNotifications,
  markNotificationAsRead,
  processEventNotification
} = require("../Controllers/notification.controller");
const authenticated = require("../Middlewares/Authmiddleware");
const authorizeRoles = require("../Middlewares/RoleMiddleware");

// Create a general notification (admin can send to anyone)
router.post(
  "/create",
  authenticated,
  authorizeRoles("Admin"),
  createNotification
);

// Send notification from formateur to their manager
router.post(
  "/send-to-manager",
  authenticated,
  authorizeRoles("Formateur"),
  sendNotificationToManager
);

// Get user's notifications
router.get(
  "/",
  authenticated,
  getUserNotifications
);

// Mark notification as read
router.put(
  "/:id/read",
  authenticated,
  markNotificationAsRead
);

// Process notification (accept/decline)
router.put(
  "/:id/process",
  authenticated,
  authorizeRoles("Manager", "Admin"),
  processEventNotification
);

module.exports = router;