import { asyncHandler } from "../../utils/asyncHandler.js";
import Projects from "../../models/projectMdoels.js";
import { success } from "zod";
import mongoose from "mongoose";

export const createProjectController = asyncHandler(async (req, res) => {
  const project = await Projects.create(req.body);

  return res.status(201).json({
    success: true,
    message: "Project created successfully",
  });
});

export const getadminProjectController = asyncHandler(async (req, res) => {
  const projects = await Projects.find({})
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  if (projects.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No projects found",
      data: {
        projects: [],
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    totalCount: projects.length,
    data: {
      projects,
    },
  });
});

export const getSingleProjectDetailsController = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Projects.findById(id).select("-__v").lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  },
);

export const deleteProjectController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }
  const project = await Projects.findByIdAndDelete(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    // data: {
    //   projectId: project._id,
    // },
  });
});


export const updateProjectController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }

  const updatedProject = await Projects.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProject) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
});


export const getUserProjectsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await Projects.find({
    assignedTo: userId,
  })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    totalCount: projects.length,
    data: {
      projects,
    },
  });
});