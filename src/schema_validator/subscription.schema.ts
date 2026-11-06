import { z } from 'zod';

export const createSubscriptionSchema = z.object({
    name: z.string().min(2).max(100),
    price: z.number().positive(),
    currency: z.enum(["USD", "EUR", "GBP", "GHC"]).default("USD"),
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    category: z.enum([
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other"
    ]),
    paymentMethod: z.string().min(1).max(255),
    status: z.enum(["active", "expired", "cancelled"]).default("active"),
    startDate: z.coerce.date(),
    renewalDate: z.coerce.date().optional(),
});

export default createSubscriptionSchema;