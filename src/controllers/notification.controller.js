import {asyncHandler} from "../utils/asyncHandler.js";
import {WebPushSubscription} from "../config/prisma.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const subscribeToPush = asyncHandler( async (req, res) => {

    const userId = req.user.id;
    const {endpoint, keys} = req.body;

    if (!endpoint || !keys) {
        return res.status(400).json({ error: "Invalid subscription object" });
    }

    await WebPushSubscription.upsert({
        where: { endpoint},
        update: {
            userId,
            p256dh: keys.p256dh,
            auth: keys.auth,
        },
        create: {
            userId,
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
        }
    })

    return res.status(200).json(new ApiResponse(200, {}, "Subscribed to Browser notifications successfully."));
})

export {
    subscribeToPush,
}