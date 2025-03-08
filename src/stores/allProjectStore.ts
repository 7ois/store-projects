import { Project } from "@/entity/project";
import axios from "axios";
import { create } from "zustand";

interface ProjectStore {
  projects: Project[];
  typeId: string | null;
  currentPage: number;
  totalCount: number;
  setProjects: (projects: Project[]) => void;
  setTypeId: (typeId: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalCount: (totalCount: number) => void;
  fetchProjects: (params: {
    typeId?: string;
    search?: string;
    year?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
}

export const useAllProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  typeId: null,
  currentPage: 1,
  totalCount: 0,
  setProjects: (projects) => set({ projects }),
  setTypeId: (typeId) => set({ typeId }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalCount: (totalCount) => set({ totalCount }),
  fetchProjects: async ({ typeId, search, year, limit = 10, offset = 0 }) => {
    try {
      const params = new URLSearchParams();

      const finalTypeId = typeId || useAllProjectStore.getState().typeId;

      if (finalTypeId && finalTypeId !== "0") {
        params.append("type_id", finalTypeId);
      }
      if (search) {
        params.append("search", search);
      }
      if (year && year !== "ทั้งหมด") {
        params.append("year", year);
      }

      params.append("limit", limit.toString());
      params.append("offset", offset.toString());

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getAllProjects?${params.toString()}`
      );

      const allProjects = response.data.data;
      const totalCount = response.data.totalCount;
      set({ projects: allProjects, totalCount });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
