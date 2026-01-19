import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const User = prisma.user
const Subscription = prisma.subscription
const Reminder = prisma.reminder
const Conversation = prisma.conversation
const Message = prisma.message
const WebPushSubscription = prisma.webPushSubscription

export {
    prisma,
    User,
    Subscription,
    Reminder,
    Conversation,
    Message,
    WebPushSubscription,
}

// export default prisma;
