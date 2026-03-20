import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  size = "md",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };

  return (
    <div
      className={cn(
        "w-full rounded-full bg-muted overflow-hidden",
        heights[size],
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          clamped >= 80
            ? "bg-emerald-500"
            : clamped >= 50
              ? "bg-primary"
              : clamped >= 25
                ? "bg-amber-500"
                : "bg-red-400",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
