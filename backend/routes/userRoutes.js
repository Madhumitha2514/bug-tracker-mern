import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users (for member selection)
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email")
      .sort({ name: 1 });

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;