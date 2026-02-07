import Comment from "../models/Comment.js";
import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------
// CREATE COMMENT
// --------------------
export const createComment = async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (!isValidId(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const comment = await Comment.create({
      ticketId,
      userId: req.user.id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "name email");
      
        // ✅ NOTIFY TICKET ASSIGNEE
        if (ticket.assignee && ticket.assignee.toString() !== req.user.id) {
          await createNotification({
            userId: ticket.assignee,
            type: "ticket_comment",
            message: `New comment on ticket: ${ticket.title}`,
            ticketId: ticket._id,
            projectId: ticket.project,
            createdBy: req.user.id,
          });
        }
    
        // ✅ NOTIFY TICKET CREATOR (if different)
        if (ticket.createdBy.toString() !== req.user.id && ticket.createdBy.toString() !== ticket.assignee?.toString()) {
          await createNotification({
            userId: ticket.createdBy,
            type: "ticket_comment",
            message: `New comment on your ticket: ${ticket.title}`,
            ticketId: ticket._id,
            projectId: ticket.project,
            createdBy: req.user.id,
          });
        }
    
    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// GET COMMENTS FOR TICKET
// --------------------
export const getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!isValidId(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const comments = await Comment.find({ ticketId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      comments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// DELETE COMMENT
// --------------------
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment creator can delete
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// UPDATE COMMENT
// --------------------
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment creator can edit
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text.trim();
    await comment.save();

    const updatedComment = await Comment.findById(id)
      .populate("userId", "name email");

    res.json({
      success: true,
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};