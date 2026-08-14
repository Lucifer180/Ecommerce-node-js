import { z } from "zod";

/**
 * The react-aria inputs hand back strings, so the form validates strings and
 * converts on submit. (`z.coerce.number()` types its input as `unknown`, which
 * defeats react-hook-form's generic inference.)
 */
const nonNegativeNumber = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, `${label} must be a non-negative number`);

export const productSchema = z.object({
    name: z.string().trim().min(1, "Product name is required"),
    description: z.string().trim().optional(),
    price: nonNegativeNumber("Price"),
    stock: nonNegativeNumber("Stock").refine((value) => Number.isInteger(Number(value)), "Stock must be a whole number"),
    category: z.string().trim().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
