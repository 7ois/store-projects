import { Project } from "@/entity/project";
import axios from "axios";
import { create } from "zustand";

interface ProjectStore {
  projects: Project[];
  typeId: string | null; // เพิ่มตัวแปร typeId ใน store
  setProjects: (projects: Project[]) => void;
  setTypeId: (typeId: string | null) => void; // เพิ่มฟังก์ชัน setTypeId
  fetchProjects: (params: {
    typeId?: string;
    search?: string;
    year?: string;
  }) => Promise<void>;
}

export const useAllProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  typeId: null, // เริ่มต้นค่าเป็น null
  setProjects: (projects) => set({ projects }),
  setTypeId: (typeId) => set({ typeId }), // อัปเดตค่า typeId
  fetchProjects: async ({ typeId, search, year }) => {
    try {
      const params = new URLSearchParams();

      // ตรวจสอบค่า typeId ใน store หากไม่เป็น null หรือ undefined จะใช้ค่าใน store แทน
      const finalTypeId = typeId || useAllProjectStore.getState().typeId;

      if (finalTypeId) {
        params.append("type_id", finalTypeId);
      }
      if (search) {
        params.append("search", search);
      }
      if (year && year !== "ทั้งหมด") {
        params.append("year", year);
      }

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/getAllProjects?${params.toString()}`,
      );
      const allProjects = response.data.data;
      set({ projects: allProjects });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
