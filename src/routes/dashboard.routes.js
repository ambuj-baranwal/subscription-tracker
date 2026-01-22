import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getDashboardStats,
    getSpendingAnalytics, getUpcomingReminders,
    getUpcomingRenewals
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getDashboardStats);
router.route("/spending").get(getSpendingAnalytics);
router.route("/upcoming").get(getUpcomingRenewals);
router.route("/upcoming-reminders").get(getUpcomingReminders);

export default router;