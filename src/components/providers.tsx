'use client';

import { useEffect, type ReactNode } from 'react';
import { useJobStore } from '@/store/job-store';

/**
 * Wraps the app tree and seeds the store on first render.
 * Add more global providers (auth, toasts, etc.) here later.
 */
export function Providers({ children }: { children: ReactNode }) {
  const initialize = useJobStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
