import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------
// CREATE TICKET
// --------------------
export const createTicket = async (req, res) => {
  try {
    const { projectId, title, description, priority, assignee, status, dueDate } = req.body;

    console.log("📝 Creating ticket:", req.body); // Debug log

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    if (!isValidId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is member
    const isMember =
      project.owner.toString() === req.user.id ||
      project.members.some(m => m.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description: description || "",
      priority: priority || "Medium",
      status: status || "Todo", // ✅ Default to Todo
      project: projectId,
      assignee: assignee || null,
      createdBy: req.user.id,
      dueDate: dueDate || null,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

         // ✅ CREATE NOTIFICATION FOR ASSIGNEE
    if (assignee && assignee !== req.user.id) {
      await createNotification({
        userId: assignee,
        type: "ticket_assigned",
        message: `You were assigned to ticket: ${title}`,
        ticketId: ticket._id,
        projectId,
        createdBy: req.user.id,
      });
    }

    res.status(201).json({
      success: true,
      ticket: populatedTicket,
    });
  } catch (err) {
    console.error("❌ Create ticket error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// GET PROJECT TICKETS
// --------------------
export const getProjectTickets = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const tickets = await Ticket.find({ project: projectId })
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// GET KANBAN TICKETS


export const getKanbanTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query; // Get from query params

    let query = { createdBy: userId };

    // Filter by project if provided
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      query.project = projectId;
    }

    const tickets = await Ticket.find(query)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const grouped = {
      Todo: [],
      InProgress: [],
      Done: [],
    };

    tickets.forEach((t) => {
      if (grouped[t.status]) {
        grouped[t.status].push(t);
      }
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// UPDATE TICKET STATUS (for drag-drop)
// --------------------
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    console.log("🔄 Updating ticket status:", req.params.id, "to", status);

    if (!["Todo", "InProgress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.json({
      success: true,
      ticket,
    });
    // ✅ NOTIFY IF ASSIGNEE CHANGED
    if (assignee && assignee !== oldTicket.assignee?.toString() && assignee !== req.user.id) {
      await createNotification({
        userId: assignee,
        type: "ticket_assigned",
        message: `You were assigned to ticket: ${oldTicket.title}`,
        ticketId: id,
        projectId: oldTicket.project,
        createdBy: req.user.id,
      });
    }
    // ✅ NOTIFY IF STATUS CHANGED
    if (status && status !== oldTicket.status && oldTicket.assignee) {
      await createNotification({
        userId: oldTicket.assignee,
        type: "ticket_status_changed",
        message: `Ticket "${oldTicket.title}" status changed to ${status}`,
        ticketId: id,
        projectId: oldTicket.project,
        createdBy: req.user.id,
      });
    } 
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// UPDATE TICKET (full update)
// --------------------
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// ASSIGN TICKET
// --------------------
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!isValidId(id) || !isValidId(userId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const project = await Project.findById(ticket.project);

    const isMember =
      project.owner.toString() === userId ||
      project.members.some(m => m.toString() === userId);

    if (!isMember) {
      return res.status(400).json({ message: "User not part of project" });
    }

    ticket.assignee = userId;
    await ticket.save();

    const updated = await Ticket.findById(id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate("project", "title");

    res.json({
      success: true,
      ticket: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// DELETE TICKET
// --------------------
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      success: true,
      message: "Ticket deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add this new function
export const getAllUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ createdBy: userId })
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};