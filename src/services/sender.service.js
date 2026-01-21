import webpush from "web-push";
import { sendEmail } from "../utils/sendEmail.utils.js";
import { WebPushSubscription } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendNotification = async (reminder, message) => {
  const { type, user, subscription } = reminder;
  try {
    if (type === "email") {
      console.log(`Sending Email to ${user.email}`);
      await sendEmail(user.email, message);
      return true;
    }

    if (type === "push") {
      const subscriptions = await WebPushSubscription.findMany({
        where: { userId: user.id },
      });

      if (subscriptions.length === 0) {
        console.warn(`No push devices found for user ${user.email}`);
        return false;
      }

      const payload = JSON.stringify({
        title: `Renewal Alert: ${subscription.name}`,
        body: message,
        url: "/subscriptions",
        // icon: "/icon.png", // update it later
      });

      const pushPromises = subscriptions.map((subscription) => {
        webpush
          .sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            payload
          )
          .catch(async (error) => {
            if (error.statusCode === 410 || error.statusCode === 404) {
              // await WebPushSubscription.delete({where: {id: subscription.id}});
              await WebPushSubscription.delete({
                where: { endpoint: subscription.endpoint },
              });
            }
            return null;
            // throw new ApiError(error.statusCode, `Push Notification Failed for ${subscription.id}`);
          });
      });
      await Promise.all(pushPromises);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Sender Error [${type}]:`, error);
    return false;
  }
};

export { sendNotification };
