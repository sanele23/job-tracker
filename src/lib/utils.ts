/** Tiny class-name joiner (no external deps needed) */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/** Format a salary range for display: "$150k – $200k" */
export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return '';
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

/** Friendly date string: "Mar 14, 2026" */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Collision-safe unique id */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
