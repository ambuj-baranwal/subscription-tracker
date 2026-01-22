import { z } from "zod";

const currencyEnum = ["INR", "USD", "EUR", "JPY"];
const frequencyEnum = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "halfYearly",
  "yearly",
];
const categoryEnum = [
  "sports",
  "news",
  "entertainment",
  "lifestyle",
  "technology",
  "finance",
  "politics",
  "other",
];
const statusEnum = ["active", "cancelled", "expired"];

const validStartDate = z.iso
  .datetime("Invalid start date format")
  .superRefine((inputDate, ctx) => {
    const date = new Date(inputDate);
    const today = new Date();
    // today.setHours(0,0,0,0)
    today.setMinutes(0, 0, 0);

    // Check 1: Ensure the date isn't in the future.
    if (today < date) {
      ctx.addIssue({
        code: z.ZodError,
        message: "Start Date can't be in the future",
      });
    }
  });

// Incomplete Validation
const validRenewalDate = z.iso
  .datetime({ error: "Invalid Renewal Date" })
  .superRefine((inputDate, ctx) => {
    const date = new Date(inputDate);
    const today = new Date();
    today.setMinutes(0, 0, 0);

    if (date < today) {
      ctx.addIssue({
        code: z.ZodError,
        message: "Renewal Date can't be in the past",
      });
    }
  });

const subscriptionBody = z
  .object({
    name: z
      .string("Name is required")

      .max(200, "Name can be at most 200 characters"),
    price: z.number().gte(0, "Price must be a positive"),
    currency: z.enum(
      currencyEnum,
      `Invalid Currency. Allowed currencies are ${currencyEnum.join(", ")}`
    ),
    frequency: z.enum(
      frequencyEnum,
      `Invalid Frequency. Allowed frequencies are ${frequencyEnum.join(", ")}`
    ),
    category: z.enum(
      categoryEnum,
      `Invalid Category. Allowed categories is ${categoryEnum.join(", ")}`
    ),
    paymentMethod: z.string().default("UPI").optional(),
    status: z.enum(
      statusEnum,
      `Invalid Status for Subscription. Allowed status is ${statusEnum.join(
        ", "
      )}`
    ),
    startDate: validStartDate,
    renewalDate: validRenewalDate.optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.renewalDate) {
        return new Date(data.renewalDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      error: "Renewal Date must be after the start date",
      path: ["validRenewalDate"],
    }
  );

const createSubscriptionSchema = z.object({
  body: subscriptionBody,
});

const updateSubscriptionSchema = z.object({
  params: z.object({
    id: z.uuidv4({ error: "Invalid Subscription Id" }),
  }),
  body: subscriptionBody.partial(),
});

export { createSubscriptionSchema, updateSubscriptionSchema };
