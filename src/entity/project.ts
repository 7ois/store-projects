import { User } from "./user";

export interface Project {
  project_id: number;
  type_id: number;
  type_name: string;
  project_name_th: string;
  project_name_en: string;
  abstract_th: string;
  abstract_en: string;
  keywords?: string[];
  date: string;
  file_name: string;
  file_path: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  users?: User[];
}
