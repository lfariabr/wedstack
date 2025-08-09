import { z } from "zod";

// Guest name search input validation
export const guestNameSearchSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
});

// Guest phone search input validation
export const guestPhoneSearchSchema = z.object({
    phone: z.string()
        .min(1, 'Phone is required')
        .max(100, 'Phone cannot exceed 100 characters')
        .trim(),
});

// Export types
export type GuestNameSearch = z.infer<typeof guestNameSearchSchema>;
export type GuestPhoneSearch = z.infer<typeof guestPhoneSearchSchema>;
