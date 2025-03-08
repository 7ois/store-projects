import { z } from "zod";

export const formProjectSchema = z
  .object({
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
    owner: z
      .array(
        z.object({
          user_id: z.number(),
          role_group: z.literal("owner"),
          value: z.string(),
        }),
      )
      .superRefine((owners, ctx) => {
        // ตรวจสอบ user_id ใน owner
        owners.forEach((owner, index) => {
          if (
            owner.value &&
            (owner.user_id === null ||
              owner.user_id === undefined ||
              owner.user_id === 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "ไม่มีผู้ใช้นี้ในระบบ",
              path: [index],
            });
          }
        });
      }),
    advisor: z
      .array(
        z.object({
          user_id: z.number(),
          role_group: z.literal("advisor"),
          value: z.string(),
        }),
      )
      .superRefine((advisors, ctx) => {
        // ตรวจสอบ user_id ใน advisor
        advisors.forEach((advisor, index) => {
          if (
            advisor.value &&
            (advisor.user_id === null ||
              advisor.user_id === undefined ||
              advisor.user_id === 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "ไม่มีผู้ใช้นี้ในระบบ",
              path: [index],
            });
          }
        });
      }),
    file: z.union([z.string().min(1, "กรุณาเลือกไฟล์"), z.instanceof(File)]),
  })
  .superRefine((data, ctx) => {
    // รวม user_id จาก owner และ advisor
    const allUserIds = [
      ...data.owner.map((owner) => owner.user_id),
      ...data.advisor.map((advisor) => advisor.user_id),
    ].filter((id) => id !== 0); // ไม่รวม user_id ที่เป็น 0

    // ตรวจสอบ user_id ห้ามซ้ำกัน
    const uniqueUserIds = new Set(allUserIds);
    if (uniqueUserIds.size !== allUserIds.length) {
      // หาตำแหน่งที่ซ้ำกัน
      const duplicateIndexes = [
        ...data.owner.map((owner, index) => ({
          user_id: owner.user_id,
          field: "owner" as const, // ระบุ type เป็น "owner"
          index,
        })),
        ...data.advisor.map((advisor, index) => ({
          user_id: advisor.user_id,
          field: "advisor" as const, // ระบุ type เป็น "advisor"
          index,
        })),
      ].filter((item) => item.user_id !== 0);

      // สร้าง map เพื่อเก็บตำแหน่งที่ซ้ำกัน
      const duplicateMap = duplicateIndexes.reduce((acc, item) => {
        if (acc[item.user_id]) {
          acc[item.user_id].push(item);
        } else {
          acc[item.user_id] = [item];
        }
        return acc;
      }, {} as Record<number, { field: "owner" | "advisor"; index: number }[]>);

      // เพิ่มข้อผิดพลาดสำหรับตำแหน่งที่ซ้ำกัน
      Object.entries(duplicateMap).forEach(([, items]) => {
        if (items.length > 1) {
          items.forEach((item) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                items.length > 1 && items.some((i) => i.field !== item.field)
                  ? `ผู้ใช้นี้ซ้ำกันระหว่างกลุ่ม owner และ advisor`
                  : `ผู้ใช้นี้ซ้ำกันภายในกลุ่ม ${item.field}`,
              path: [item.field, item.index],
            });
          });
        }
      });
    }
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
      // สร้าง key จาก path array
      const key = error.path.join(".");
      errors[key] = error.message;
    });
    setValidationErrors(errors);
    return false;
  }

  setValidationErrors({});
  return true;
};
