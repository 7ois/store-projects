import { User } from "./user";

export interface Project {
  project_id: number;
  type_id: number;
  project_name: string;
  description: string;
  keywords?: string;
  date: string;
  file_name: string;
  file_path: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  users?: User[];
}
