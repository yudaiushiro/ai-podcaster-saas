export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  monthly_quota: number;
  is_admin: boolean;
} 