import { Router } from "express";
import {
  createSubscription,
  deleteAllSubscriptions,
  deleteSubscription,
  getSubscriptionById,
  getSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validations/subscription.validation.js";

const router = Router();
router.use(verifyJWT);

router.route("/delete-all-subscriptions").put(deleteAllSubscriptions);

router
  .route("/")
  .get(getSubscriptions)
  .post(validate(createSubscriptionSchema), createSubscription);

router
  .route("/:id")
  .get(getSubscriptionById)
  .put(validate(updateSubscriptionSchema), updateSubscription)
  .delete(deleteSubscription);

// router.route("/:id/cancel").put(verifyJWT);

export default router;
