import { Router } from "express"
import {
    createSubscription, deleteAllSubscriptions, deleteSubscription,
    getSubscriptionById,
    getSubscriptions,
    updateSubscription
} from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validate.middleware.js";
import {createSubscriptionSchema} from "../validations/subscription.validation.js";

const router = Router();

router.route('/delete-all-subscriptions').put(verifyJWT, deleteAllSubscriptions)


router.route('/')
    .get(verifyJWT, getSubscriptions)
    .post(verifyJWT, validate(createSubscriptionSchema), createSubscription)

router.route('/:id')
    .get(verifyJWT, getSubscriptionById)
    .put(verifyJWT, updateSubscription)
    .delete(verifyJWT, deleteSubscription)

router.route('/:id/cancel')
    .put(verifyJWT, )

router.route('/upcoming-renewals')
    .get(verifyJWT, )

router.route('/user/:id')
    .get(verifyJWT, )

export default router;