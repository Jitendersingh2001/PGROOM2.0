
import { Minus, Plus } from "lucide-react";

interface GoalCardProps {
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  data: number[];
}

export function GoalCard({ title, subtitle, value, unit, data }: GoalCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex items-center justify-center my-4 gap-4">
        <button className="rounded-full w-8 h-8 flex items-center justify-center border hover:bg-accent transition-colors">
          <Minus className="h-4 w-4" />
        </button>
        
        <div className="text-center">
          <span className="text-4xl font-bold">{value}</span>
          <p className="text-xs text-muted-foreground uppercase">{unit}</p>
        </div>
        
        <button className="rounded-full w-8 h-8 flex items-center justify-center border hover:bg-accent transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-end justify-between h-20 gap-1 mb-4">
        {data.map((value, index) => (
          <div 
            key={index} 
            className="w-full bg-sidebar-primary rounded-md" 
            style={{ height: `${(value / Math.max(...data)) * 100}%` }}
          />
        ))}
      </div>
      
      <button className="w-full p-2 bg-sidebar-primary text-white rounded-lg hover:opacity-90 transition-opacity">
        Set Goal
      </button>
    </div>
  );
}
