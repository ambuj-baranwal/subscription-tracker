import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const User = prisma.user
const Subscription = prisma.subscription
const Reminder = prisma.reminder
const Conversation = prisma.conversation
const Message = prisma.message

export {
    prisma,
    User,
    Subscription,
    Reminder,
    Conversation,
    Message,
}

// export default prisma;
