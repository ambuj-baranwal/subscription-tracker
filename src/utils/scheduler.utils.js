import cron from "node-cron";
import { Reminder, User } from "../config/prisma.js"; // Import models
import { sendEmail } from "./sendEmail.utils.js";
import { calculateSendDate } from "./dateHandler.utils.js";

const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const dueReminders = await Reminder.findMany({
        where: {
          sendAt: { lte: now },
          enabled: true,
        },
        include: { user: true },
      });

      for (const reminder of dueReminders) {
        try {
          await sendEmail(reminder.user.email);
          console.log(`Reminder sent for ${reminder.id}`);

          if (reminder.scheduleType === "once") {
            await Reminder.update({
              where: { id: reminder.id },
              data: { enabled: false },
            });
          } else {
            const nextDate = calculateSendDate(reminder.scheduleType);
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
    }
  });

  console.log("📅 Reminder Scheduler Initialized");
};

export default initScheduler;
