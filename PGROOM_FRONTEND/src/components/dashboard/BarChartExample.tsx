"use client"

import React from 'react';
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
 * BarChartExample - A component that demonstrates the usage of the MonthlyIncomeChart
 * 
 * This component serves as an example of how to use the refactored MonthlyIncomeChart
 * component with sample data.
 */
export function BarChartExample() {
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Bar Chart Example</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Example with default title and description */}
        <MonthlyIncomeChart data={chartData} />
        
        {/* Example with custom title and description */}
        <MonthlyIncomeChart 
          data={chartData} 
          title="Income Overview" 
          description="First half of 2023" 
        />
      </div>
    </div>
  );
}

export default BarChartExample;
