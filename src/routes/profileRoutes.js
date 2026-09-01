
import express from 'express';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware.js';
import { deleteProfileController, fetchProfileController, updateProfileController } from '../controller/users/profileController.js';
import { upload } from '../middleware/multer.js';
import { validate } from '../middleware/validate.js'
import { updateProfileSchema } from '../validators/authValidators.js';

const router = express.Router();

router.get("/user-profile",authenticationMiddleware,fetchProfileController);
router.patch("/update-profile",authenticationMiddleware,upload.single("profilePic"),validate(updateProfileSchema),
  updateProfileController
);

router.delete('/delete-profile',authenticationMiddleware,deleteProfileController)

export default router