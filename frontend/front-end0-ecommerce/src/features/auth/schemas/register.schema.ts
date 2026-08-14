import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().trim().min(1, "Name is required"),
        email: z.email("Enter a valid email address"),
        // Mirrors the backend's `isLength({ min: 8 })` rule.
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
