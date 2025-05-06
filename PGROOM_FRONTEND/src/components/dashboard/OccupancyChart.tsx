import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OccupancyChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    total: number;
  }[];
  className?: string;
}

/**
 * OccupancyChart - A component for displaying room occupancy as a donut chart
 * 
 * @param data - Array of data points with name, value, and color
 * @param className - Optional additional class names
 */
const OccupancyChart: React.FC<OccupancyChartProps> = ({ data, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Room Occupancy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                // Remove the label from the pie chart itself
                label={false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Status
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0].name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Rooms
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                formatter={(value, entry, index) => {
                  const { payload } = entry;
                  const percent = ((payload.value / payload.total) * 100).toFixed(0);
                  return `${value}: ${percent}%`;
                }}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
