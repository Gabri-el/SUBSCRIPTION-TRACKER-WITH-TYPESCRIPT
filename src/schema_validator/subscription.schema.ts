import { z } from 'zod';

export const createSubscriptionSchema = z.object({
    name: z.string().min(2).max(100),
    price: z.number().positive(),
    currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]).default("USD"),
    frequency: z.enum(["monthly", "quarterly", "annual"]),
    category: z.enum([
        "news",
        "entertainment",
        "lifestyle",
        "finance",
        "education",
        "politics",
        "news",
    ]),
    paymentMethod: z.string().min(1).max(255),
    status: z.enum(["active", "paused", "cancelled"]).default("active"),
    startDate: z.coerce.date(),
    renewalDate: z.coerce.date().optional(),
});

export default createSubscriptionSchema;