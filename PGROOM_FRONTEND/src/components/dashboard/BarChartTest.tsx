"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MonthlyIncomeChart from './MonthlyIncomeChart';

/**
 * Sample data for the bar chart
 */
const chartData = [
  { name: "January", income: 186000 },
  { name: "February", income: 305000 },
  { name: "March", income: 237000 },
  { name: "April", income: 73000 },
  { name: "May", income: 209000 },
  { name: "June", income: 214000 },
];

/**
 * BarChartTest - A component to test the bar chart in different container sizes
 */
export function BarChartTest() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Bar Chart Test</h1>
      
      {/* Test in a full-width container */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Full Width Container</h2>
        <MonthlyIncomeChart data={chartData} />
      </div>
      
      {/* Test in a constrained width container */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Constrained Width Container (500px)</h2>
        <div className="max-w-[500px]">
          <MonthlyIncomeChart data={chartData} />
        </div>
      </div>
      
      {/* Test in a grid layout */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Grid Layout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonthlyIncomeChart 
            data={chartData} 
            title="First Chart" 
          />
          <MonthlyIncomeChart 
            data={chartData} 
            title="Second Chart" 
          />
        </div>
      </div>
      
      {/* Test in a custom height container */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Height Container (400px)</h2>
        <Card>
          <CardContent className="p-6">
            <div className="h-[400px]">
              <MonthlyIncomeChart data={chartData} className="h-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BarChartTest;
