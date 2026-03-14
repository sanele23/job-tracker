"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobFormSchema,
  type JobFormValues,
  transformFormToJob,
} from "@/lib/validations/job";
import { useJobStore } from "@/store/job-store";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_OPTIONS } from "@/lib/constants";
import type { Job, JobStatus } from "@/types";

interface JobFormProps {
  job?: Job | null;
  defaultStatus?: JobStatus;
  onClose: () => void;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

export function JobForm({
  job,
  defaultStatus = "wishlist",
  onClose,
}: JobFormProps) {
  const addJob = useJobStore((s) => s.addJob);
  const updateJob = useJobStore((s) => s.updateJob);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      company: job?.company ?? "",
      role: job?.role ?? "",
      salary_min: job?.salary_min?.toString() ?? "",
      salary_max: job?.salary_max?.toString() ?? "",
      status: job?.status ?? defaultStatus,
      date_applied: job?.date_applied ?? "",
      notes: job?.notes ?? "",
      contact_name: job?.contact_name ?? "",
      contact_email: job?.contact_email ?? "",
      url: job?.url ?? "",
      tags: job?.tags?.join(", ") ?? "",
    },
  });

  const onSubmit = (values: JobFormValues) => {
    const data = transformFormToJob(values);
    if (job) {
      updateJob(job.id, data);
    } else {
      addJob(data, user?.id);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* company + role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company *" error={errors.company?.message}>
          <input
            {...register("company")}
            placeholder="e.g. Stripe"
            className={inputClass}
          />
        </Field>
        <Field label="Role *" error={errors.role?.message}>
          <input
            {...register("role")}
            placeholder="e.g. Senior Frontend Engineer"
            className={inputClass}
          />
        </Field>
      </div>

      {/* status */}
      <Field label="Status">
        <select {...register("status")} className={inputClass}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      {/* salary */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Min Salary">
          <input
            {...register("salary_min")}
            type="number"
            placeholder="150000"
            className={inputClass}
          />
        </Field>
        <Field label="Max Salary" error={errors.salary_max?.message}>
          <input
            {...register("salary_max")}
            type="number"
            placeholder="200000"
            className={inputClass}
          />
        </Field>
      </div>

      {/* date */}
      <Field label="Date Applied">
        <input
          {...register("date_applied")}
          type="date"
          className={inputClass}
        />
      </Field>

      {/* url */}
      <Field label="Job URL" error={errors.url?.message}>
        <input
          {...register("url")}
          placeholder="https://company.com/careers/role"
          className={inputClass}
        />
      </Field>

      {/* contact */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact Name">
          <input
            {...register("contact_name")}
            placeholder="Sarah Chen"
            className={inputClass}
          />
        </Field>
        <Field label="Contact Email" error={errors.contact_email?.message}>
          <input
            {...register("contact_email")}
            placeholder="sarah@company.com"
            className={inputClass}
          />
        </Field>
      </div>

      {/* notes */}
      <Field label="Notes" error={errors.notes?.message}>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Interview prep, key dates, thoughts…"
          className={inputClass + " resize-none"}
        />
      </Field>

      {/* tags */}
      <Field label="Tags">
        <input
          {...register("tags")}
          placeholder="react, typescript, remote (comma-separated)"
          className={inputClass}
        />
      </Field>

      {/* actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {job ? "Update Job" : "Add Job"}
        </button>
      </div>
    </form>
  );
}

/* ── tiny field wrapper ────────────────────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
