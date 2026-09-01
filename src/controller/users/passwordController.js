import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/userModels.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { sendOtpEmail } from "../../utils/email.js";


export const forgetSendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does't exist",
    });
  }

  const otp = generateOtp();

  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  // OTP email par send
  // await sendOtpEmail(email, otp);
  await sendOtpEmail(email,otp)

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});


export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

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
  if (user.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // OTP verified → remove OTP from DB
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