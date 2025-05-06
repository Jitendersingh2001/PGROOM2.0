import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyIncomeChartProps {
  data: {
    name: string;
    income: number;
  }[];
  className?: string;
}

/**
 * MonthlyIncomeChart - A component for displaying monthly income data
 *
 * @param data - Array of data points with month name and income value
 * @param className - Optional additional class names
 */
const MonthlyIncomeChart: React.FC<MonthlyIncomeChartProps> = ({ data, className }) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <p className="font-medium text-gray-600 dark:text-gray-300">{`${label}`}</p>
          <p className="text-green-600 dark:text-green-400 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Monthly Income</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
              barCategoryGap={1}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#888888', fontSize: 9 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => `₹${value / 1000}k`}
                tick={{ fill: '#888888', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
                iconType="square"
                iconSize={10}
              />
              <Bar
                dataKey="income"
                name="Monthly Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={32}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyIncomeChart;
