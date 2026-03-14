'use client';

import { useJobStore } from '@/store/job-store';
import { STATUS_OPTIONS } from '@/lib/constants';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import type { JobStatus } from '@/types';

interface SearchFilterProps {
  onAddClick: () => void;
}

export function SearchFilter({ onAddClick }: SearchFilterProps) {
  const searchQuery   = useJobStore((s) => s.searchQuery);
  const statusFilter  = useJobStore((s) => s.statusFilter);
  const setSearch     = useJobStore((s) => s.setSearchQuery);
  const setStatus     = useJobStore((s) => s.setStatusFilter);

  return (
    <div className="flex flex-col sm:flex-row gap-3 px-4 lg:px-6 py-3">
      {/* search */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies, roles, tags…"
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-3">
        {/* status filter */}
        <div className="relative">
          <SlidersHorizontal
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value as JobStatus | 'all')}
            className="pl-9 pr-8 py-2 rounded-lg border border-border bg-background text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* add button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Job</span>
        </button>
      </div>
    </div>
  );
}
