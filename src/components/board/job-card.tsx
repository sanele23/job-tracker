'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '@/types';
import { cn, formatSalary, formatDate } from '@/lib/utils';
import {
  Building2,
  Calendar,
  DollarSign,
  GripVertical,
  Pencil,
  Trash2,
  User,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  isOverlay?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
}

export function JobCard({ job, isOverlay, onEdit, onDelete }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const salary = formatSalary(job.salary_min, job.salary_max);
  const dateApplied = formatDate(job.date_applied);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group bg-card rounded-lg border border-border p-3 shadow-sm select-none',
        'hover:shadow-md hover:border-primary/30 transition-all duration-200',
        isDragging && 'opacity-40 shadow-lg',
        isOverlay && 'shadow-xl rotate-2 scale-105 border-primary/50',
      )}
    >
      {/* header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Building2 size={14} className="text-muted-foreground flex-shrink-0" />
            <p className="font-semibold text-sm text-foreground truncate">
              {job.company}
            </p>
          </div>
          <p className="text-sm text-muted-foreground truncate pl-[22px]">
            {job.role}
          </p>
        </div>

        {/* action buttons (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={() => onEdit?.(job)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete?.(job.id)}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={13} />
          </button>
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={13} />
          </button>
        </div>
      </div>

      {/* meta row */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground pl-[22px]">
        {salary && (
          <span className="flex items-center gap-1">
            <DollarSign size={11} /> {salary}
          </span>
        )}
        {dateApplied && (
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {dateApplied}
          </span>
        )}
        {job.contact_name && (
          <span className="flex items-center gap-1">
            <User size={11} /> {job.contact_name}
          </span>
        )}
      </div>

      {/* tags */}
      {job.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 pl-[22px]">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* notes peek */}
      {job.notes && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 pl-[22px]">
          {job.notes}
        </p>
      )}
    </motion.div>
  );
}
