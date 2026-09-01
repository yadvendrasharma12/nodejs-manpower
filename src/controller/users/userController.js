
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/userModels.js";

import { hashPassword , comparePassword } from "../../utils/hashPassword.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/cookie.js";
import { env } from "../../config/env.js";


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

  // Profile picture
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
    message: "Logout successful",
  });
});

// export const refreshTokenController = asyncHandler(async (req, res) => {

//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({
//       success: false,
//       message: "Refresh token required",
//     });
//   }

//   try {

//     const decoded = jwt.verify(
//       refreshToken,
//       env.Refresh_token
//     );

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const newAccessToken = generateAccessToken(user);

//     setAccessTokenCookie(res, newAccessToken);

//     return res.status(200).json({
//       success: true,
//       message: "Access token refreshed",
//     });

//   } catch (error) {

//     return res.status(401).json({
//       success: false,
//       message: "Refresh token expired or invalid",
//     });

//   }
// });
