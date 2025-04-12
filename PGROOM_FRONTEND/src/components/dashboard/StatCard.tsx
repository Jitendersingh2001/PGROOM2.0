
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, positive, children, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {change && (
          <p className={cn(
            "text-xs",
            positive ? "text-emerald-500" : "text-red-500"
          )}>
            {change}
          </p>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
