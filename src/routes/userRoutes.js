import express from "express";

import { registerController } from "../controller/userController.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/multer.js";
import { registerSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePic"),
  validate(registerSchema),
  registerController
);

export default router;