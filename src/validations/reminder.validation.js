import {z} from "zod";

const validReminderDate = z
    .iso.datetime("Invalid date format")
    .superRefine((inputDate, ctx) => {
        const date = new Date(inputDate);
        const today = new Date();

        // Check 1: Ensure the date isn't in the past.
        if (today > date) {
            ctx.addIssue({
                code: z.ZodError,
                message: "Reminder Date can't be in the past"
            })
        }
    })

const createReminderSchema = z.object({
    body: z.object({
        userId: z.uuid("Invalid User Id").optional(),
        subscriptionId: z.uuid("Invalid Subscription Id"),
        type: z.string().optional().default('email'),
        payload: z.json("Invalid Payload json format") ,
        timezone: z.enum(['India+05:30', "USA-05:00", "Japan+09:00", "Europe+01:00", "UTC"]).default("UTC"),
        scheduleType: z.enum(['once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly'], 'Invalid Frequency').default('monthly'),
        cronExpression: z.string().optional(),
        sendAt: validReminderDate.optional(),
        enabled: z.boolean().default(true) ,
        attempts: z.int().optional().default(0),
        maxAttempts: z.int().lt(4).optional() ,
    })
})

export {
    createReminderSchema,
}