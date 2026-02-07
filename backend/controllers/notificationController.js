import Notification from "../models/Notification.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------
// GET USER NOTIFICATIONS
// --------------------
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const notifications = await Notification.find({ userId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// MARK AS READ
// --------------------
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// MARK ALL AS READ
// --------------------
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// DELETE NOTIFICATION
// --------------------
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// HELPER: CREATE NOTIFICATION
// --------------------
export const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};