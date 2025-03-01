import { z } from "zod";

export const formProjectSchema = z.object({
  project_name_th: z.string().min(1, "กรุณากรอกชื่อโครงการ (ภาษาไทย)"),
  project_name_en: z.string().min(1, "กรุณากรอกชื่อโครงการ (ภาษาอังกฤษ)"),
  abstract_th: z.string().min(1, "กรุณากรอกบทคัดย่อ (ภาษาไทย)"),
  abstract_en: z.string().min(1, "กรุณากรอกบทคัดย่อ (ภาษาอังกฤษ)"),
  keyword: z.array(z.string()).min(1, "กรุณากรอกคำสำคัญ"),
  date: z.string().min(1, "กรุณากรอกวันที่"),
  type_id: z.number().min(1, "กรุณาเลือกประเภทโครงการ"),
  main_owner: z.object({
    user_id: z.number(),
    role_group: z.literal("main_owner"),
    value: z.string(),
  }),
  owner: z.array(
    z.object({
      user_id: z.number(),
      role_group: z.literal("owner"),
      value: z.string(),
    }),
  ),
  advisor: z.array(
    z.object({
      user_id: z.number(),
      role_group: z.literal("advisor"),
      value: z.string(),
    }),
  ),
  file: z.union([z.string().min(1, "กรุณาเลือกไฟล์"), z.instanceof(File)]),
});

export type FormProjectData = z.infer<typeof formProjectSchema>;

export const validateFormData = <T,>(
  formData: T,
  schema: z.ZodSchema<T>,
  setValidationErrors: (errors: { [key: string]: string }) => void,
): boolean => {
  const result = schema.safeParse(formData);

  if (!result.success) {
    const errors: { [key: string]: string } = {};
    result.error.errors.forEach((error) => {
      errors[error.path[0]] = error.message;
    });
    setValidationErrors(errors);
    return false;
  }

  setValidationErrors({});
  return true;
};
