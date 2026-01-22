import cron from "node-cron";
import { Reminder } from "../config/prisma.js";
import { calculateNextCycleDate } from "./dateHandler.utils.js";
import { sendNotification } from "../services/sender.service.js";

let isRunning = false;

const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.warn("⏳ Cron skipped (previous run still active)");
      return;
    }

    isRunning = true;
    console.log("⏰ Cron tick started");

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
          if (reminder.attempts >= reminder.maxAttempts) {
            await Reminder.update({
              where: { id: reminder.id },
              data: { enabled: false },
            });
            continue;
          }

          const success = await sendNotification(reminder);

          if (!success) {
            throw new Error("Sender service failed");
          }

          if (reminder.subscription.frequency === "once") {
            await Reminder.update({
              where: { id: reminder.id },
              data: { enabled: false, attempts: 0 },
            });
          } else {
            let nextDate = new Date(reminder.sendAt);

            while (nextDate <= now) {
              nextDate = calculateNextCycleDate(
                reminder.subscription.frequency,
                nextDate
              );
            }

            await Reminder.update({
              where: { id: reminder.id },
              data: { sendAt: nextDate, attempts: 0 },
            });
          }

          console.log(`Reminder ${reminder.id} sent`);
        } catch (err) {
          console.error(`Reminder ${reminder.id} failed`, err);

          await Reminder.update({
            where: { id: reminder.id },
            data: { attempts: { increment: 1 } },
          });
        }
      }
    } catch (error) {
      console.error("Scheduler fatal error:", error);
    } finally {
      isRunning = false;
    }
  });

  console.log("📅 Reminder Scheduler Initialized");
};

export default initScheduler;
