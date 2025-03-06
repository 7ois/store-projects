import { Project } from "@/entity/project";
import axios from "axios";
import { create } from "zustand";

interface MyProjectStore {
  projects: Project[];
  currentPage: number;
  totalCount: number;
  setProjects: (projects: Project[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalCount: (totalCount: number) => void;
  fetchMyProjects: (params: {
    search?: string;
    year?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
}

export const useMyProjectStore = create<MyProjectStore>((set) => ({
  projects: [],
  currentPage: 1,
  totalCount: 0,
  setProjects: (projects) => set({ projects }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalCount: (totalCount) => set({ totalCount }),
  fetchMyProjects: async ({ search, year, limit = 10, offset = 0 }) => {
    try {
      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }
      if (year && year !== "ทั้งหมด") {
        params.append("year", year);
      }
      params.append("limit", limit.toString());
      params.append("offset", offset.toString());

      const token = localStorage.getItem("token");
      const response = await axios.get<{
        success: boolean;
        data: Project[];
        totalCount: number;
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}/getMyProjects?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const myProjects = response.data.data;
      const totalCount = response.data.totalCount;
      set({ projects: myProjects, totalCount });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
