import cron from "node-cron";
import {Reminder, Subscription} from "../config/prisma.js";
import { calculateNextCycleDate } from "./dateHandler.utils.js";
import { sendNotification } from "../services/sender.service.js";
import {subDays} from "date-fns";
import {asyncHandler} from "./asyncHandler.js";

let isRunning = false;

const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.warn("⏳ Cron skipped (previous run still active)");
      return;
    }

    isRunning = true;
    console.log("⏰ Reminder Check started");

    try {
      const now = new Date();

      const dueReminders = await Reminder.findMany({
        where: {
          sendAt: { lte: now },
          enabled: true,
        },
        include: { user: true, subscription: true },
        take: 50,
      });

      for (const reminder of dueReminders) {
        try {
          const success = await sendNotification(reminder);

          if (reminder.subscription.frequency === "once") {
            await Reminder.update({
              where: { id: reminder.id },
              data: { enabled: false, attempts: 0 },
            });
          } else {
            let nextRenewalDate = new Date(reminder.subscription.renewalDate);

            while (nextRenewalDate <= now) {
              nextRenewalDate = calculateNextCycleDate(
                reminder.subscription.frequency,
                nextRenewalDate
              );
            }
            const nextSendAt = subDays(nextRenewalDate, reminder.daysBefore)

            await Reminder.update({
              where: { id: reminder.id },
              data: { sendAt: nextSendAt, attempts: 0 },
            });
          }

          console.log(`Reminder ${reminder.id} rescheduled for ${nextSendAt.toISOString()}`);
        } catch (err) {
          console.error(`Reminder ${reminder.id} failed`, err);

          await Reminder.update({
            where: { id: reminder.id },
            data: { attempts: { increment: 1 } },
          });
        }
      }
    } catch (error) {
      console.error("Scheduler error:", error);
    } finally {
      isRunning = false;
    }
  });

  cron.schedule("0 0 * * *", asyncHandler(async () => {
      console.log("🔄 Running Subscription Auto-Renewal Job");

      const now = new Date();

      const expiredSubscriptions = await Subscription.findMany({
          where: {
              status: "active",
              renewalDate: {lt: now},
              frequency: {not: "once"}
          }
      })

      for (const subscription of expiredSubscriptions) {
          let nextDate = new Date(subscription.renewalDate);

          while (nextDate <= now) {
              nextDate = calculateNextCycleDate(subscription.frequency, nextDate)
          }

          await Subscription.update({
              where: { id: subscription.id },
              data: { renewalDate: nextDate },
          })

          console.log(`Updated Subscription ${subscription.id} renewal to ${nextDate.toISOString()}`)
      }
  }))

  console.log("📅 Reminder Scheduler Initialized");
};

export default initScheduler;
