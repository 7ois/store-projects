import { Project } from "@/entity/project";
import axios from "axios";
import { create } from "zustand";

interface MyProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  fetchMyProjects: (params: {
    search?: string;
    year?: string;
  }) => Promise<void>;
}

export const useMyProjectStore = create<MyProjectStore>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  fetchMyProjects: async ({ search, year }) => {
    try {
      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }
      if (year && year !== "ทั้งหมด") {
        params.append("year", year);
      }

      const token = localStorage.getItem("token");
      const response = await axios.get<{ success: boolean; data: Project[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/getMyProjects?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const myProjects = response.data.data;
      set({ projects: myProjects });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
