import { User } from "@/entity/user";
import axios from "axios";
import { create } from "zustand";

interface UserStore {
  users: User[];
  currentPage: number;
  totalCount: number;
  setUsers: (projects: User[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalCount: (totalCount: number) => void;
  fetchUsers: (params: {
    search?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
}

export const useUsersStore = create<UserStore>((set) => ({
  users: [],
  currentPage: 1,
  totalCount: 0,
  setUsers: (users) => set({ users }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalCount: (totalCount) => set({ totalCount }),
  fetchUsers: async ({ search, limit = 10, offset = 0 }) => {
    try {
      const params = new URLSearchParams();

      if (search) {
        params.append("search", search);
      }
      params.append("limit", limit.toString());
      params.append("offset", offset.toString());

      const response = await axios.get<{
        success: boolean;
        data: User[];
        totalCount: number;
      }>(`${process.env.NEXT_PUBLIC_API_URL}/getAllUsers?${params.toString()}`);

      const resUsers = response.data.data;
      const totalCount = response.data.totalCount;
      console.log("users", resUsers);
      set({ users: resUsers, totalCount });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
