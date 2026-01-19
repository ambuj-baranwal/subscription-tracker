import cron from "node-cron";
import { Reminder } from "../config/prisma.js";
import { calculateNextCycleDate } from "./dateHandler.utils.js";
import { sendNotification } from "../services/sender.service.js";
import { ApiError } from "./ApiError.js";

const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Cron tick started");
    const now = new Date();
    const dueReminders = await Reminder.findMany({
      where: {
        sendAt: { lte: now },
        enabled: true,
      },
      include: { user: true, subscription: true },
    });
    console.log("Scheduler util", dueReminders);
    console.log("Scheduler util", dueReminders[0]?.subscription.frequency);

    for (const reminder of dueReminders) {
      try {
        if (reminder.attempts >= reminder.maxAttempts) {
          console.warn(
            `Reminder ${reminder.id} disabled. Max attempts reached.`
          );
          await Reminder.update({
            where: { id: reminder.id },
            data: { enabled: false },
          });
          continue;
        }

        const success = await sendNotification(reminder);
        if (!success) {
          console.error(`Sender service failed for ${reminder}`);
          throw new ApiError(500, `Sender service failed`);
        }
        if (reminder.subscription.frequency === "once") {
          await Reminder.update({
            where: { id: reminder.id },
            data: { enabled: false, attempts: 0 },
          });
        } else {
          const nextDate = calculateNextCycleDate(
            reminder.subscription.frequency,
            reminder.sendAt
          );
          await Reminder.update({
            where: { id: reminder.id },
            data: { sendAt: nextDate, attempts: 0 }, // on success attempts is zero
          });
        }
        console.log(
          `✅ Reminder sent for ${reminder.subscription.name} to ${reminder.user.email}`
        );
      } catch (error) {
        console.error(`Reminder ${reminder.id} failed : `, error);
        await Reminder.update({
          where: { id: reminder.id },
          data: { attempts: { increment: 1 } },
        });
        throw new ApiError(
          500,
          `Reminder ${reminder.id} failed : ${error?.message}`
        );
      }
    }
  });

  console.log(`📅  Reminder Scheduler Initialized`);
};

export default initScheduler;
