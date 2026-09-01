import express from "express";

import{ loginController, logOutController, registerController } from "../controller/users/userController.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/multer.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";
import { forgetSendOtpController, resetPasswordController, verifyOtpController } from "../controller/users/passwordController.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePic"),
  validate(registerSchema),
  registerController
);

router.post("/login",validate(loginSchema),loginController);

router.post('/logOut', logOutController);
router.post("/forget-password",forgetSendOtpController);
router.post("/veryfy-otp",verifyOtpController);
router.post("/reset-password",resetPasswordController)

export default router;