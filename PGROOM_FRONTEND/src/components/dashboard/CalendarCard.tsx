
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarCardProps {
  month: string;
  year: number;
}

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarCard({ month, year }: CalendarCardProps) {
  // This is a simplified calendar for display purposes
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 4; // Start from the previous month
    return {
      day: day <= 0 ? 30 + day : day > 30 ? day - 30 : day,
      isCurrentMonth: day > 0 && day <= 30,
      isToday: day === 13,
      isSelected: day === 5
    };
  });

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button className="rounded-full p-1 hover:bg-accent">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="font-semibold">{month} {year}</h3>
          <button className="rounded-full p-1 hover:bg-accent">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground p-1">
            {day}
          </div>
        ))}
        
        {days.map((day, i) => (
          <div key={i} className="text-center">
            <button
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                !day.isCurrentMonth && "text-muted-foreground/50",
                day.isToday && "bg-sidebar-primary text-white",
                day.isSelected && "bg-sidebar-accent"
              )}
            >
              {day.day}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
