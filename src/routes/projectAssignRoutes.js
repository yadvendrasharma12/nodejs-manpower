
import express from "express";

import { authenticationMiddleware } from "../middleware/authenticationMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { assignProjectController, deleteAssignProjectController, getAssignAdminManpowerController, getAssignUserManpowerController } from "../controller/users/assignProjectController.js";
import { validate } from "../middleware/validate.js";
import { assignProjectSchema } from "../validators/assignProjectValidators.js";

const router = express.Router();

router.post("/create",authenticationMiddleware,adminMiddleware,validate(assignProjectSchema),assignProjectController);
router.get(
  "/fetch-project",
  authenticationMiddleware,
  getAssignUserManpowerController
);

router.get("/all-assign",authenticationMiddleware,adminMiddleware,getAssignAdminManpowerController);
router.delete("/delete/:id",authenticationMiddleware,adminMiddleware,deleteAssignProjectController)

export default router;