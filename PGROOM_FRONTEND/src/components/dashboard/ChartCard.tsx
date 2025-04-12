
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface ChartCardProps {
  title: string;
  data: any[];
  dataKey: string;
  color?: string;
  children?: React.ReactNode;
}

export function ChartCard({ title, data, dataKey, color = "#10B981", children }: ChartCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-2">
        <h3 className="font-semibold">{title}</h3>
        {children}
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 3, fill: "white", stroke: color, strokeWidth: 2 }}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
