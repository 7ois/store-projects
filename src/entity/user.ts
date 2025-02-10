export interface User {
  user_id?: number;
  role_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  role_group?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
