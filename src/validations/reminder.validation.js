import { z } from "zod";

const reminderTypeEnum = ["email", "push"];

const timezoneEnum = [
  "America/New_York",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/Berlin",
  "UTC",
];

const validReminderDate = z.iso
  .datetime("Invalid sendAt date format")
  .superRefine((inputDate, ctx) => {
    const date = new Date(inputDate);
    const today = new Date();
    today.setMinutes(0, 0, 0);

    // Check 1: Ensure the date isn't in the past.
    if (date < today) {
      ctx.addIssue({
        code: z.ZodError,
        message: "Reminder Date can't be in the past",
      });
    }
  });

const reminderBody = z.object({
  subscriptionId: z.uuidv4({ error: "Invalid Subscription Id" }).optional(),
  // type: z.string().optional().default('email'),
  type: z.enum(reminderTypeEnum).default("email"),
  payload: z.json("Invalid Payload json format").optional(),
  timezone: z
    .enum(timezoneEnum, {
      error: `Invalid Timezone. Allowed Timezones are ${timezoneEnum.join(
        ", "
      )}`,
    })
    .default("UTC"),
  sendAt: validReminderDate,
  // sendAt: validReminderDate.optional(),
  // enabled: z.boolean().default(true) ,
});

const createReminderSchema = z.object({
  params: z.object({
    subscriptionId: z.uuidv4({ error: "Invalid Subscription Id" }),
  }),
  body: reminderBody,
});

const updateReminderSchema = z.object({
  params: z.object({
    subscriptionId: z.uuidv4({ error: "Invalid Subscription Id" }),
    id: z.uuidv4({ error: "Invalid Reminder Id" }),
  }),
  body: reminderBody.partial(),
});

export { createReminderSchema, updateReminderSchema };
