import express from "express";

import{ loginController, logOutController, registerController } from "../controller/users/userController.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/multer.js";
import { forgetemailSchema, ForgetOtpSchema, loginSchema, registerSchema, ResetPasswordSchema, } from "../validators/authValidators.js";
import { changePasswordController, forgetSendOtpController, resetPasswordController, verifyOtpController } from "../controller/users/passwordController.js";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware.js";
import { deleteProfileController } from "../controller/users/profileController.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePic"),
  validate(registerSchema),
  registerController
);

router.post("/login",validate(loginSchema),loginController);

router.post('/logOut', logOutController);
router.post("/forget-password",validate(forgetemailSchema),forgetSendOtpController);
router.post("/veryfy-otp",validate(ForgetOtpSchema),verifyOtpController);
router.post("/reset-password",validate(ResetPasswordSchema),resetPasswordController);
router.post('/change-password',authenticationMiddleware,changePasswordController);



export default router;