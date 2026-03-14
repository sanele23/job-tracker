'use client';

import { useJobStore } from '@/store/job-store';
import { COLUMNS } from '@/lib/constants';
import { motion } from 'framer-motion';

export function StatsBar() {
  const getStats = useJobStore((s) => s.getStats);
  const stats = getStats();

  return (
    <div className="flex flex-wrap gap-2 px-4 lg:px-6 py-3">
      {/* total */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm"
      >
        <span className="font-bold text-foreground">{stats.total}</span>
        <span className="text-muted-foreground">Total</span>
      </motion.div>

      {/* per-status */}
      {COLUMNS.map((col, i) => (
        <motion.div
          key={col.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: col.color + '15' }}
        >
          <span className="font-bold" style={{ color: col.color }}>
            {stats[col.id]}
          </span>
          <span className="text-muted-foreground">{col.title}</span>
        </motion.div>
      ))}
    </div>
  );
}
