import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/userModels.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { sendOtpEmail } from "../../utils/email.js";
import bcrypt from "bcrypt";



export const forgetSendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }

  const otp = generateOtp();

  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendOtpEmail(email, otp);

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});


// ==================== VERIFY OTP ====================

export const verifyOtpController = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = req.body.otp?.trim();

  console.log("EMAIL:", email);
  console.log("OTP:", otp);

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const user = await User.findOne({ email });

  console.log("USER:", user);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check OTP expiry
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    await User.findByIdAndUpdate(user._id, {
      $unset: {
        otp: 1,
        otpExpiresAt: 1,
      },
    });

    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  // Check OTP
  if (user.otp?.toString() !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // OTP remove
  await User.findByIdAndUpdate(user._id, {
    $unset: {
      otp: 1,
      otpExpiresAt: 1,
    },
  });

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});



export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const hashedPassword = await hashPassword(password);

  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});


// ==================== CHANGE PASSWORD ====================

export const changePasswordController = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Logged-in user ko ID se find karo
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Old password verify karo
  const isPasswordCorrect = await comparePassword(
    oldPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Incorrect old password",
    });
  }

  // New password ko hash karo
  const hashedPassword = await hashPassword(newPassword);

  // Password update karo
  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});