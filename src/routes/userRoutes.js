import express from "express";

import { loginController, logOutController, refreshTokenController, registerController } from "../controller/userController.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/multer.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePic"),
  validate(registerSchema),
  registerController
);

router.post('/login',validate(loginSchema),loginController);
router.post("/refresh-token",refreshTokenController
);

router.post('/logOut', logOutController)

export default router;