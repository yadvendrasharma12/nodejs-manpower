import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/userModels.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { success } from "zod";


export const fetchProfileController = asyncHandler(async(req,res)=>{

const user = await User.findById(req.user.id)
  .select("-password -otp -otpExpiresAt -isPhoneVerified -refreshToken -__v")
  .lean();

  if(!user){
    return res.status(200).json({
      success:false,
      message:"User profile not found",
      profile:[]
    })
  };

  return res.status(200).json({
    success:true,
    message:"Profile fetched successfully",
    profile:{
      user
    }
  })
});

export const updateProfileController = asyncHandler(async (req, res) => {

  const {
    email,
    phone,
    name,
    gender,
    dateOfBirth,
  } = req.body;

  const updateData = {
    email,
    phone,
    name,
    gender,
    dateOfBirth,
  };


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

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-password -otp -otpExpiresAt -refreshToken -__v")
    .lean();

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User profile deleted successfully",
  });
});



