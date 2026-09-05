
import express from "express";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { deleteUsersController, getAllUsersController, updateAllUsersController } from "../controller/users/userController.js";


const router = express.Router();

router.get('/users',authenticationMiddleware,adminMiddleware,getAllUsersController);
router.patch('/users/:id',authenticationMiddleware,adminMiddleware,updateAllUsersController);
router.delete("/users/:id",authenticationMiddleware,adminMiddleware,deleteUsersController);




export default router;