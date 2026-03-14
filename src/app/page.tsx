'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { StatsBar } from '@/components/dashboard/stats-bar';
import { SearchFilter } from '@/components/dashboard/search-filter';
import { KanbanBoard } from '@/components/board/kanban-board';
import { JobForm } from '@/components/board/job-form';
import { Modal } from '@/components/ui/modal';

export default function Home() {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full py-2">
        <StatsBar />
        <SearchFilter onAddClick={() => setAddModalOpen(true)} />

        <div className="mt-2">
          <KanbanBoard />
        </div>
      </main>

      {/* global "Add Job" modal (from the top-bar button) */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Job"
      >
        <JobForm onClose={() => setAddModalOpen(false)} />
      </Modal>
    </div>
  );
}
