import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getDashboardStats,
    getSpendingAnalytics,
    getUpcomingRenewals
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getDashboardStats);
router.route("/spending").get(getSpendingAnalytics);
router.route("/upcoming").get(getUpcomingRenewals);

export default router;