import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/userModels.js";
import { success } from "zod";
import mongoose from "mongoose";

export const fetchManpowerController = asyncHandler(async (req, res) => {
  const manpower = await User.find({
    role: "user",
  })
    .select("name email phone createdAt")
    .lean();

  if (manpower.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Manpower not found",
      totalCount: 0,
      manpower: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Manpower fetched successfully",
    totalCount: manpower.length,
    manpower,
  });
});

export const fetchSingleManpowerController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const manpower = await User.findOne({
    _id: id,
    role: "user",
  })
    .select("-password -refreshToken -__v")
    .lean();

  if (!manpower) {
    return res.status(404).json({
      success: false,
      message: "Manpower not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Manpower fetched successfully",
    data: {
      manpower,
    },
  });
});

export const updatemanpowerController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }


  if (req.file) {
    const updateImageResponse = await uploadOnCloudinary(
      req.file.buffer
    );

    if (!updateImageResponse) {
      return res.status(500).json({
        success: false,
        message: "Profile image upload failed",
      });
    }

    updateData.profilePic = updateImageResponse.secure_url;
  }

  // Update only manpower/user
  const updateManpower = await User.findOneAndUpdate(
    {
      _id: id,
      role: "user",
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-password -refreshToken -__v")
    .lean();

  if (!updateManpower) {
    return res.status(404).json({
      success: false,
      message: "Manpower not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Manpower updated successfully",
    data: {
      manpower: updateManpower,
    },
  });
});

export const deletemanpowerController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const deleteManpower = await User.findOneAndDelete({
    _id: id,
    role: "user",
  });

  if (!deleteManpower) {
    return res.status(404).json({
      success: false,
      message: "Manpower not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Manpower deleted successfully",
  
  });
});


// User.findOneAndUpdate and findByIdAndUpdate inme main diifrent findone me multipule condition laga sakte h lekin id me nhi