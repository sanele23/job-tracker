'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useJobStore } from '@/store/job-store';
import { COLUMNS } from '@/lib/constants';
import type { Job, JobStatus } from '@/types';
import { KanbanColumn } from './column';
import { JobCard } from './job-card';
import { JobForm } from './job-form';
import { Modal } from '@/components/ui/modal';

export function KanbanBoard() {
  const jobs          = useJobStore((s) => s.jobs);
  const moveJob       = useJobStore((s) => s.moveJob);
  const deleteJob     = useJobStore((s) => s.deleteJob);
  const getJobsByStatus = useJobStore((s) => s.getJobsByStatus);

  /* ── drag state ── */
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeId) ?? null,
    [jobs, activeId],
  );

  /* ── modal state ── */
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingJob, setEditingJob]     = useState<Job | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<JobStatus>('wishlist');

  /* ── sensors ── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /* ── handlers ── */
  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = e;
      if (!over) return;

      const draggedId = active.id as string;
      const overId    = over.id as string;

      // dropped on a column header / drop-zone
      const col = COLUMNS.find((c) => c.id === overId);
      if (col) {
        moveJob(draggedId, col.id);
        return;
      }

      // dropped on another card → move into that card's column at its position
      const target = jobs.find((j) => j.id === overId);
      if (target) {
        moveJob(draggedId, target.status, target.position);
      }
    },
    [jobs, moveJob],
  );

  const openAddModal = useCallback((status: JobStatus) => {
    setEditingJob(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((job: Job) => {
    setEditingJob(job);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Delete this job application?')) deleteJob(id);
    },
    [deleteJob],
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 px-4 lg:px-6 scroll-smooth">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              jobs={getJobsByStatus(column.id)}
              onAddClick={() => openAddModal(column.id)}
              onEditJob={openEditModal}
              onDeleteJob={handleDelete}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* add / edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Job' : 'Add Job'}
      >
        <JobForm
          key={editingJob?.id ?? 'new'}
          job={editingJob}
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
}
