import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {subscribeToPush} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.put("/subscribe", subscribeToPush)

export default router;
