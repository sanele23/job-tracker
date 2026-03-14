'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ColumnDef, Job } from '@/types';
import { JobCard } from './job-card';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: ColumnDef;
  jobs: Job[];
  onAddClick: () => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

export function KanbanColumn({
  column,
  jobs,
  onAddClick,
  onEditJob,
  onDeleteJob,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex-shrink-0 w-[300px] lg:w-[320px]">
      {/* column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{column.icon}</span>
          <h3 className="font-semibold text-foreground text-sm">{column.title}</h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: column.color + '20',
              color: column.color,
            }}
          >
            {jobs.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={`Add to ${column.title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[200px] rounded-xl p-2 transition-colors duration-200',
          isOver
            ? 'bg-primary/10 ring-2 ring-primary/20'
            : 'bg-muted/50',
        )}
      >
        <SortableContext
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={onEditJob}
                onDelete={onDeleteJob}
              />
            ))}
          </div>
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex items-center justify-center h-[120px] text-muted-foreground text-sm">
            Drop jobs here
          </div>
        )}
      </div>
    </div>
  );
}
