import mongoose from "mongoose";
import Project from "../models/Project.js";

// -----------------------------
// Helper: validate ObjectId
// -----------------------------
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// -----------------------------
// Create new project
// -----------------------------
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Get all projects for user
// -----------------------------
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Get single project
// -----------------------------
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const hasAccess =
      project.owner._id.toString() === req.user.id ||
      project.members.some((m) => m._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Update project
// -----------------------------
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can update project" });
    }

    const { title, description } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Delete project
// -----------------------------
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can delete project" });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Add member
// -----------------------------
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can add members" });
    }

    const exists = project.members.some(
      (member) => member.toString() === userId
    );

    if (exists) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------
// Remove member
// -----------------------------
export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can remove members" });
    }

    if (userId === project.owner.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot remove project owner" });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    // ✅ NOTIFY NEW MEMBER
    await createNotification({
      userId: userId,
      type: "project_member_added",
      message: `You were added to project: ${project.title}`,
      projectId: project._id,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
