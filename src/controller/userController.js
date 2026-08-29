import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/userModels.js";

import { hashPassword } from "../utils/hashPassword.js";
import { generateOtp } from "../utils/generateOtp.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerController = asyncHandler(async (req, res) => {

  const {
    email,
    phone,
    password,
    name,
    gender,
    dateOfBirth,
  } = req.body;

  const existingUser = await User.findOne({
    $or: [
      { email },
      { phone },
    ],
  }).lean();

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

    const cloudinaryResponse =
      await uploadOnCloudinary(req.file.buffer);

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Profile image upload failed",
      });
    }

    profilePic = cloudinaryResponse.secure_url;
  }



  const hashedPassword =await hashPassword(password);
  const otp = generateOtp();


  const otpExpiresAt = new Date(
    Date.now() + 5 * 60 * 1000
  );


  const user = await User.create({
    email,
    phone,
    password: hashedPassword,
    name,
    gender,
    dateOfBirth,
    profilePic,
    otp,
    otpExpiresAt,
    isPhoneVerified: false,
  });
  console.log(`OTP for ${phone}: ${otp}`);


  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.otp;
  delete userResponse.otpExpiresAt;
  delete userResponse.refreshToken;



  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: userResponse,
    },

  });

});