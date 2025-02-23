import { z } from "zod";

export const registerSchema = z
  .object({
    role_id: z.number(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"), // ตรวจสอบว่า confirmPassword ไม่เป็นค่าว่าง
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type registerSchemaType = z.infer<typeof registerSchema>;
