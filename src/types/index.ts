export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  user_id?: string;
  company: string;
  role: string;
  salary_min?: number | null;
  salary_max?: number | null;
  status: JobStatus;
  date_applied?: string | null;
  notes?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  url?: string | null;
  tags: string[];
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ColumnDef {
  id: JobStatus;
  title: string;
  color: string;
  icon: string;
}
