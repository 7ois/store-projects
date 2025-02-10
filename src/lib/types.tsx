import { z } from "zod"

export const registerSchema = z
    .object({
        role_id: z
            .number(),
        email: z.string().email(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        first_name: z
            .string()
            .min(1, "Enter your first name"),
        last_name: z.string().min(1, "Enter your last name"),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

export type registerSchemaType = z.infer<typeof registerSchema>