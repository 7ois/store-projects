import { z } from "zod";

export const registerSchema = z
  .object({
    role_id: z.number().optional(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  // ตรวจสอบ first_name
  .refine(
    (data) => {
      if (data.email.endsWith("@rmuti.ac.th")) {
        return data.first_name !== undefined && data.first_name !== "";
      }
      return true;
    },
    {
      message: "First name is required for @rmuti.ac.th emails",
      path: ["first_name"],
    },
  )
  // ตรวจสอบ last_name
  .refine(
    (data) => {
      if (data.email.endsWith("@rmuti.ac.th")) {
        return data.last_name !== undefined && data.last_name !== "";
      }
      return true;
    },
    {
      message: "Last name is required for @rmuti.ac.th emails",
      path: ["last_name"],
    },
  )
  // ตรวจสอบ role_id
  .refine(
    (data) => {
      if (data.email.endsWith("@rmuti.ac.th")) {
        return (
          data.role_id !== undefined &&
          data.role_id !== 4 &&
          data.role_id !== null
        );
      }
      return true;
    },
    {
      message: "Role is required for @rmuti.ac.th emails",
      path: ["role_id"],
    },
  );

export type registerSchemaType = z.infer<typeof registerSchema>;
