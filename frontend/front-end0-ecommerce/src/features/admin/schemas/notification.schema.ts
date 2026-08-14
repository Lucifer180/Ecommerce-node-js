import { z } from "zod";

export const notificationSchema = z.object({
    subject: z.string().trim().min(1, "Subject is required").max(150, "Keep the subject under 150 characters"),
    message: z.string().trim().min(1, "Message is required"),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
