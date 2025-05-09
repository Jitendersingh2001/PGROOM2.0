import React, { useEffect, useState } from 'react';
import { Home, Users, DoorOpen, Wallet } from 'lucide-react';
import StatsCard from './StatsCard';
import TenantsList from './TenantsList';
import OccupancyChart from './OccupancyChart';
import MonthlyIncomeChart from './MonthlyIncomeChart';
import { cn } from '@/lib/utils';
import { dashboardService, MonitoringCardsResponse } from '@/lib/api/services/dashboardService';

// Mock data for the occupancy chart
const mockOccupancyData = [
  { name: 'Occupied', value: 18, color: 'hsl(var(--primary))', total: 25 },
  { name: 'Available', value: 7, color: '#f59e0b', total: 25 },
];

// Mock data for the tenants list
const mockTenants = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    status: 'active' as const,
    joinDate: '2023-05-15T00:00:00Z',
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    status: 'active' as const,
    joinDate: '2023-06-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    status: 'invited' as const,
    joinDate: '2023-06-10T00:00:00Z',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    status: 'active' as const,
    joinDate: '2023-06-15T00:00:00Z',
  },
];

// Mock data for monthly income chart
const mockMonthlyIncomeData = [
  { name: 'Jan', income: 25000 },
  { name: 'Feb', income: 28000 },
  { name: 'Mar', income: 32000 },
  { name: 'Apr', income: 30000 },
  { name: 'May', income: 35000 },
  { name: 'Jun', income: 38000 },
  { name: 'Jul', income: 42000 },
  { name: 'Aug', income: 45000 },
  { name: 'Sep', income: 40000 },
  { name: 'Oct', income: 38000 },
  { name: 'Nov', income: 35000 },
  { name: 'Dec', income: 32000 },
];

interface StatsDashboardProps {
  className?: string;
  // In a real application, these would be fetched from an API
  propertyCount?: number;
  roomCount?: number;
  assignedRoomCount?: number;
  expectedMonthlyIncome?: number;
  tenants?: typeof mockTenants;
  occupancyData?: typeof mockOccupancyData;
  monthlyIncomeData?: typeof mockMonthlyIncomeData;
}

/**
 * StatsDashboard - A dashboard component displaying key statistics, charts, and tenant list
 *
 * This component is designed to be used in the owner dashboard page.
 * It displays key metrics, a monthly income chart, a room occupancy chart,
 * and a list of recent tenants.
 */
const StatsDashboard: React.FC<StatsDashboardProps> = ({
  className,
  propertyCount: propPropertyCount,
  roomCount: propRoomCount,
  assignedRoomCount: propAssignedRoomCount,
  expectedMonthlyIncome: propExpectedMonthlyIncome,
  tenants = mockTenants,
  occupancyData = mockOccupancyData,
  monthlyIncomeData = mockMonthlyIncomeData,
}) => {
  // State for monitoring cards data
  const [monitoringData, setMonitoringData] = useState<MonitoringCardsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use props values or data from API
  const propertyCount = monitoringData?.totalProperties ?? propPropertyCount ?? 5;
  const roomCount = monitoringData?.totalRooms ?? propRoomCount ?? 25;
  const assignedRoomCount = monitoringData?.totalAssignedTenants ?? propAssignedRoomCount ?? 18;
  const expectedMonthlyIncome = monitoringData?.expectedMonthlyIncome ?? propExpectedMonthlyIncome ?? 320000;

  // Fetch monitoring cards data
  useEffect(() => {
    const fetchMonitoringCards = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardService.getMonitoringCards();
        if (response.statusCode === 200) {
          setMonitoringData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitoringCards();
  }, []);

  // Calculate occupancy rate
  const occupancyRate = roomCount > 0 ? Math.round((assignedRoomCount / roomCount) * 100) : 0;

  // Generate occupancy data based on room counts
  const generatedOccupancyData = [
    { name: 'Occupied', value: assignedRoomCount, color: 'hsl(var(--primary))', total: roomCount },
    { name: 'Available', value: roomCount - assignedRoomCount, color: '#f59e0b', total: roomCount },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Properties"
          value={propertyCount}
          icon={<Home className="w-5 h-5" />}
          description="Properties managed"
          isLoading={isLoading}
        />

        <StatsCard
          title="Total Rooms"
          value={roomCount}
          icon={<DoorOpen className="w-5 h-5" />}
          description="Available rooms"
          isLoading={isLoading}
        />

        <StatsCard
          title="Total Assigned Tenants"
          value={assignedRoomCount}
          icon={<Users className="w-5 h-5" />}
          description="Active tenants"
          isLoading={isLoading}
        />

        <StatsCard
          title="Expected Monthly Income"
          value={new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).format(expectedMonthlyIncome)}
          icon={<Wallet className="w-5 h-5" />}
          description="Monthly rental revenue"
          isLoading={isLoading}
        />
      </div>

      {/* Monthly Income Chart - Full width */}
      <div className="mt-8 mb-8">
        <MonthlyIncomeChart data={monthlyIncomeData} />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart - Takes up 1/2 of the width on large screens */}
        <div className="lg:col-span-1 h-full">
          <OccupancyChart data={generatedOccupancyData} className="h-full" />
        </div>

        {/* Tenants List - Takes up 1/2 of the width on large screens */}
        <div className="lg:col-span-1 h-full">
          <TenantsList tenants={tenants} className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
