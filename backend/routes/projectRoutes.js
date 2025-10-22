import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// Helper: Validate projectId format
const isValidProjectId = (id) => typeof id === "string" && id.trim().length > 0;

// POST /api/projects - Create or update a project
router.post("/", async (req, res) => {
  try {
    const { projectId, name, files } = req.body;

    // Validate projectId
    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    // Validate project name
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "Invalid or missing project name" });
    }

    // Validate files array
    if (!Array.isArray(files) || files.some(f => typeof f.filename !== "string")) {
      return res.status(400).json({ message: "Invalid files array" });
    }

    // Sanitize files: ensure content exists
    const sanitizedFiles = files.map(f => ({
      filename: f.filename,
      content: typeof f.content === "string" ? f.content : ""
    }));

    let project = await Project.findOne({ projectId });

    if (project) {
      // Update existing project
      project.name = name.trim();
      project.files = sanitizedFiles;
      project.updatedAt = new Date();
      await project.save();
      return res.json({ message: "Project updated successfully", project });
    } else {
      // Create new project
      project = new Project({ projectId, name: name.trim(), files: sanitizedFiles });
      await project.save();
      return res.status(201).json({ message: "Project created successfully", project });
    }
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return res.status(500).json({ message: "Server error while saving project" });
  }
});

// GET /api/projects/:projectId - Load project by ID
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ project });
  } catch (error) {
    console.error("Error in GET /api/projects/:projectId:", error);
    return res.status(500).json({ message: "Server error while loading project" });
  }
});

export default router;
