
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/userModels.js";

import { hashPassword , comparePassword } from "../../utils/hashPassword.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/cookie.js";
import { env } from "../../config/env.js";
import { success } from "zod";
import mongoose from "mongoose";


export const registerController = asyncHandler(async (req, res) => {
  const {
    email,phone, password,name,gender,dateOfBirth,} = req.body;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  }).select("-password -refreshToken -__v -isPhoneVerified").lean();

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (existingUser.phone === phone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }
  }

  
  let profilePic = "";

  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(
      req.file.buffer
    );

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Profile image upload failed",
      });
    }

    profilePic = cloudinaryResponse.secure_url;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    phone,
    password: hashedPassword,
    name,
    gender,
    dateOfBirth,
    profilePic,
  });

  // Remove sensitive fields from response
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.__v;
  delete userResponse.isPhoneVerified;

  // Generate token
  const token = generateAccessToken(user);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    data: {
      user: userResponse,
    },
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ $or: [ { email }] });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordCorrect = await comparePassword(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  const accessToken = generateAccessToken(existingUser);
  // const refreshToken = generateRefreshToken(existingUser);
  setAccessTokenCookie(res, accessToken);
  // setRefreshTokenCookie(res, refreshToken);
  const userResponse = existingUser.toObject();

  delete userResponse.password;
  delete userResponse.otp;
  delete userResponse.otpExpiresAt;
  delete userResponse.refreshToken;
  delete userResponse.__v;

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    // refreshToken,
    data: {
      user: userResponse,
    },
  });
});


export const logOutController = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});


export const getAllUsersController = asyncHandler(async (req, res) => {

  const allUsers = await User.find({ role: "user" })
    .select("-password -refreshToken -createdAt -updatedAt -__v")
    .sort({ createdAt: -1 })
    .lean();

  if (allUsers.length === 0) {
    return res.status(200).json({
      success: false,
      message: "Users not found",
      users: []
    });
  }

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    totalCount:allUsers.length,
    users: allUsers
  });

});


// export const updateAllUsersController = asyncHandler(async(req,res)=>{

//   const {id} = req.body;
// const updateUser = await User.findByIdAndUpdate(id,
//   req.body,
//   {
//     new:true,
//     runValidators:true
//   }
// ).select("-password -refreshToken -createdAt -updatedAt -__v").lean();

// if(!updateUser){
//   return res.status(404).json({
//     success:false,
//     message:"User not found"
//   });
// }

// return res.status(200).json({

//   success:true,
//   message:'User updated successfully'
// })


   



// })


export const updateAllUsersController = asyncHandler(async (req, res) => {

  const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  const {name, email, phone,gender, dateOfBirth, role, status, profilePic} = req.body;

  const updateUser = await User.findByIdAndUpdate(
  id,
    {
      name,email, phone,gender, dateOfBirth,role, status, profilePic,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken -createdAt -updatedAt -__v").lean();

  if (!updateUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updateUser,
  });
});



export const deleteUsersController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

  const deleteUser = await User.findByIdAndDelete(id);

  if (!deleteUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
