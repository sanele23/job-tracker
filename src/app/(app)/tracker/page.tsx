"use client";

import { useState, useMemo } from "react";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { KanbanBoard } from "@/components/board/kanban-board";
import { JobForm } from "@/components/board/job-form";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useCareerStore } from "@/store/career-store";
import { CAREER_ROLES } from "@/features/career/data";

export default function TrackerPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const targetRoleId = useCareerStore((s) => s.targetRoleId);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);

  const readiness = useMemo(() => {
    const role = CAREER_ROLES.find((r) => r.id === targetRoleId);
    if (!role) return null;
    const completed = role.requiredSkills.filter((s) =>
      completedSkillIds.includes(s),
    ).length;
    const total = role.requiredSkills.length;
    return {
      role,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [targetRoleId, completedSkillIds]);

  return (
    <div className="py-2">
      {/* Readiness Banner */}
      {readiness && (
        <div className="px-4 lg:px-6 pb-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Readiness for{" "}
                <span className="font-semibold text-foreground">
                  {readiness.role.title}
                </span>
              </p>
              <span className="text-sm font-bold text-primary">
                {readiness.percentage}%
              </span>
            </div>
            <ProgressBar value={readiness.percentage} size="sm" />
          </div>
        </div>
      )}

      <StatsBar />
      <SearchFilter onAddClick={() => setAddModalOpen(true)} />

      <div className="mt-2">
        <KanbanBoard />
      </div>

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
