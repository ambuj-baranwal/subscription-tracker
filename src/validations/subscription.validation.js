import { z } from "zod";

const validStartDate = z.iso
  .datetime("Invalid date format")
  .superRefine((inputDate, ctx) => {
    const date = new Date(inputDate);
    const today = new Date();

    // Check 1: Ensure the date isn't in the future.
    if (today < date) {
      ctx.addIssue({
        code: z.ZodError,
        message: "Start Date can't be in the future",
      });
    }
  });

// Incomplete Validation
const validRenewalDate = z.iso.datetime().superRefine((inputDate, ctx) => {
  const date = new Date(inputDate);
  const today = new Date();

  if (today > date) {
    ctx.addIssue({
      code: z.ZodError,
      message: "Renewal Date can't be in the past",
    });
  }
});

const createSubscriptionSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .max(200, "Name can be at most 200 characters"),
    price: z.number().gte(0, "Price must be a positive"),
    currency: z.enum(["INR", "USD", "EUR", "JPY"], "Invalid Currency"),
    frequency: z.enum(
      ["daily", "weekly", "monthly", "quarterly", "halfYearly", "yearly"],
      "Invalid Frequency"
    ),
    category: z.enum(
      [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      "Invalid Category"
    ),
    paymentMethod: z.string(),
    status: z.enum(
      ["active", "cancelled", "expired"],
      "Invalid Status for Subscription"
    ),
    startDate: validStartDate, // z.iso.datetime("Invalid Date Format", ) ,
    renewalDate: z.iso.datetime("Invalid Date").optional(),
  }),
});

const updateSubscriptionSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: createSubscriptionSchema.shape.body.partial(),
});

export { createSubscriptionSchema, updateSubscriptionSchema };
