import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validate.middleware.js";
import {createReminderSchema, updateReminderSchema} from "../validations/reminder.validation.js";
import {
    createReminder,
    deleteReminder,
    getAllReminders,
    getReminderById,
    updateReminder
} from "../controllers/reminder.controller.js";


const router = new Router({mergeParams: true});

/*
Expected body (example for daily):
{
  user_id,
  subscription_id,
  type: 'email',
  payload: { to, subject, text },
  timezone: 'Asia/Kolkata',
  schedule_type: 'daily',
  send_at: '2025-10-28T09:00:00', // local time in the timezone above OR an ISO in tz
  cron_expr: null,
  max_attempts: 3
}
*/

router.route('/')
    .get(verifyJWT, getAllReminders)
    .post(verifyJWT, validate(createReminderSchema), createReminder)

router.route('/:id')
    .get(verifyJWT, getReminderById)
    .put(verifyJWT, validate(updateReminderSchema), updateReminder)
    .delete(verifyJWT, deleteReminder)

export default router;