import { asyncHandler } from "../../utils/asyncHandler.js";
import Assign from "../../models/assignProjectModels.js";
import Projects from "../../models/projectMdoels.js";
import User from "../../models/userModels.js";
import mongoose from "mongoose";
import { success } from "zod";

export const assignProjectController = asyncHandler(async (req, res) => {
  const { projectId, userId, centerName, role } = req.body;

  // Check Project ID
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }

  // Check User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  // Check project exists
  const project = await Projects.findById(projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // Check user exists
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Create assignment
  const assignment = await Assign.create({
    project: projectId,
    user: userId,
    centerName,
    role,
  });

  return res.status(201).json({
    success: true,
    message: "Project assigned successfully",
    data: {
      assignment,
    },
  });
});



export const getAssignUserManpowerController = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    console.log("Logged in user ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const assignUser = await Assign.find({
      user: userId,
    })
      .populate("project")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    if (assignUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No project assignments found",
        data: [],
      });
    }

    const assignments = assignUser.map((item) => ({
      assignment: {
        _id: item._id,
        centerName: item.centerName,
        role: item.role,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
      project: item.project,
      user: item.user,
    }));

    return res.status(200).json({
      success: true,
      message: "Project assignments fetched successfully",
      totalCount: assignments.length,
      assignments,
    });
  }
);


export const getAssignAdminManpowerController = asyncHandler(
  async (req, res) => {

    const assignUser = await Assign.find({})
      .populate("project")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    if (assignUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No project assignments found",
        data: [],
      });
    }

    const assignments = assignUser.map((item) => ({
      assignment: {
        _id: item._id,
        centerName: item.centerName,
        role: item.role,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },

      project: item.project,

      user: item.user,
    }));

    return res.status(200).json({
      success: true,
      message: "All project assignments fetched successfully",
      totalCount: assignments.length,
      assignments,
    });
  }
);

export const deleteAssignProjectController = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const deletedProject = await Assign.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Assign project not found",
        projects:[]
      }); 
    }

    return res.status(200).json({
      success: true,
      message: "Project assignment deleted successfully",
      data: {
        assignment: deletedProject,
      },
    });
  }
);