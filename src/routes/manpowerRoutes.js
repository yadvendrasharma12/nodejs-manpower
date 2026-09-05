

import express from "express";
import { authenticationMiddleware } from "../middleware/authenticationMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { deletemanpowerController, fetchManpowerController, fetchSingleManpowerController, updatemanpowerController } from "../controller/manpowerController.js";

const router = express.Router();

router.get('/fetch',authenticationMiddleware,adminMiddleware,fetchManpowerController);

router.get('/fetch/:id',authenticationMiddleware,adminMiddleware,fetchSingleManpowerController);
router.put('/update/:id',authenticationMiddleware,adminMiddleware,updatemanpowerController);
router.delete('/delete/:id',authenticationMiddleware,adminMiddleware,deletemanpowerController)


export default router;