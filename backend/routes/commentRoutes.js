import express from "express";
import {
  createComment,
  getTicketComments,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createComment);
router.get("/ticket/:ticketId", getTicketComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;