import cron from "node-cron";
import { prisma, Reminder, Subscription } from "../config/prisma.js";
import { sendEmail } from "./sendEmail.utils.js";
import {
  calculateNextPaymentDate,
  calculateNextReminderTime,
} from "./dateHandler.utils.js";

const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const dueReminders = await Reminder.findMany({
        where: {
          sendAt: { lte: now },
          enabled: true,
          subscription: { status: "active" },
        },
        include: { user: true, subscription: true },
      });

      for (const reminder of dueReminders) {
        try {
          await sendEmail(reminder.user.email);
          console.log(`Reminder Email sent for ${reminder.id}`);

          // recheck & update
          const currentRenewal = new Date(reminder.subscription.renewalDate);
          const currentReminderDate = new Date(reminder.sendAt)

            const gapDuration = currentRenewal.getTime() - currentReminderDate.getTime();

          const subscription = await Subscription.findUnique({
            where: { id: reminder.subscriptionId },
          });

          const nextRenewal = calculateNextPaymentDate(
            subscription.frequency,
            subscription.renewalDate
          );
          const nextReminder = calculateNextReminderTime(nextRenewal, 1);

          await prisma.$transaction([
            Subscription.update({
              where: { id: subscription.id },
              data: { renewalDate: nextRenewal },
            }),
            Reminder.update({
              where: { id: reminder.id },
              data: { sendAt: nextReminder, attempts: 0 },
            }),
          ]);

          if (reminder.scheduleType === "once") {
            await Reminder.update({
              where: { id: reminder.id },
              data: { enabled: false },
            });
          } else {
            const nextDate = calculateNextPaymentDate(reminder.scheduleType);
            await Reminder.update({
              where: { id: reminder.id },
              data: { sendAt: nextDate },
            });
          }
        } catch (err) {
          console.error(`Failed to process reminder ${reminder.id}`, err);
        }
      }
    } catch (error) {
      console.error("Scheduler Error:", error);
      const newAttempts = reminder.attempts + 1;
      const shouldDisable = newAttempts >= reminder.maxAttempts;

      await Reminder.update({
        where: { id: reminder.id },
        data: {
          attempts: newAttempts,
          enabled: !shouldDisable,
        },
      });
    }
  });

  console.log("📅 Reminder Scheduler Initialized");
};

export default initScheduler;
