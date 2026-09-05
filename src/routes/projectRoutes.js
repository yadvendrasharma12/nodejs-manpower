import express from "express";

import { authenticationMiddleware } from "../middleware/authenticationMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validate.js";

import { createProjectSchema } from "../validators/projectValidators.js";
import { createProjectController, deleteProjectController, getadminProjectController, getSingleProjectDetailsController, getUserProjectsController, updateProjectController } from "../controller/users/projectController.js";

const router = express.Router();

router.post(
  "/create",authenticationMiddleware,adminMiddleware,validate(createProjectSchema),createProjectController);

  router.get('/fetch-project',authenticationMiddleware,adminMiddleware,getadminProjectController);
  router.get('/fetch-project/:id',authenticationMiddleware,adminMiddleware,getSingleProjectDetailsController);
  router.delete('/delete/:id',authenticationMiddleware,adminMiddleware,deleteProjectController);
  router.patch("/update/:id",authenticationMiddleware,adminMiddleware,updateProjectController);
  router.get("/my-projects",authenticationMiddleware,getUserProjectsController
);




export default router;