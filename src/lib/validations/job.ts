import { z } from 'zod';
import type { Job } from '@/types';

/* ── form schema (all strings – we transform on submit) ── */
export const jobFormSchema = z
  .object({
    company:       z.string().min(1, 'Company name is required').max(100, 'Max 100 characters'),
    role:          z.string().min(1, 'Role is required').max(100, 'Max 100 characters'),
    salary_min:    z.string(),
    salary_max:    z.string(),
    status:        z.enum(['wishlist', 'applied', 'interview', 'offer', 'rejected']),
    date_applied:  z.string(),
    notes:         z.string().max(1000, 'Max 1000 characters'),
    contact_name:  z.string().max(100),
    contact_email: z.string(),
    url:           z.string(),
    tags:          z.string(),
  })
  .refine(
    (d) => {
      if (d.contact_email && d.contact_email.length > 0) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact_email);
      }
      return true;
    },
    { message: 'Invalid email address', path: ['contact_email'] },
  )
  .refine(
    (d) => {
      if (d.url && d.url.length > 0) {
        try { new URL(d.url); return true; } catch { return false; }
      }
      return true;
    },
    { message: 'Invalid URL', path: ['url'] },
  )
  .refine(
    (d) => {
      if (d.salary_min && d.salary_max) {
        return Number(d.salary_min) <= Number(d.salary_max);
      }
      return true;
    },
    { message: 'Min salary must be ≤ max salary', path: ['salary_max'] },
  );

export type JobFormValues = z.infer<typeof jobFormSchema>;

/** Turn validated form values into a shape the store understands. */
export function transformFormToJob(
  values: JobFormValues,
): Omit<Job, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'position'> {
  return {
    company:       values.company,
    role:          values.role,
    salary_min:    values.salary_min ? Number(values.salary_min) : null,
    salary_max:    values.salary_max ? Number(values.salary_max) : null,
    status:        values.status,
    date_applied:  values.date_applied || null,
    notes:         values.notes || null,
    contact_name:  values.contact_name || null,
    contact_email: values.contact_email || null,
    url:           values.url || null,
    tags:          values.tags
      ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  };
}
