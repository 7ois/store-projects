import { z } from "zod";

export const registerSchema = z
  .object({
    role_id: z.number().optional(),
    email: z.string().email({ message: 'กรุณากรอก "อีเมล" ให้ถูกต้อง' }),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(1, "จำเป็นต้องยืนยันรหัสผ่าน"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านจะต้องตรงกัน",
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
      message: "กรุณากรอกชื่อจริง",
      path: ["first_name"],
    }
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
      message: "กรุณากรอกนามสกุล",
      path: ["last_name"],
    }
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
      message: 'กรุณาเลือก "ประเภทผู้ใช้"',
      path: ["role_id"],
    }
  );

export type registerSchemaType = z.infer<typeof registerSchema>;
