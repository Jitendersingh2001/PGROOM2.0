import React, { useEffect, useState } from 'react';
import { CreditCard, Calendar, Wrench } from 'lucide-react';
import { dashboardService } from '@/lib/api/services/dashboardService';
import { paymentService } from '@/lib/api/services/paymentService';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import TenantNavbar from '@/components/tenant/TenantNavbar';
import TenantSidebar from '@/components/tenant/TenantSidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from "@/contexts/AuthContext";

interface TenantStatsData {
  rentDueDate: string;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  maintenanceRequests: number;
}

const TenantDashboard = () => {
  const { userRole } = useAuth();
  const [statsData, setStatsData] = useState<TenantStatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Replace with actual API calls when backend is ready
    // Simulated data fetch
    const fetchTenantStats = async () => {
      try {
        setIsLoading(true);
        // This should be replaced with actual API calls
        const mockData: TenantStatsData = {
          rentDueDate: '2024-02-05',
          lastPaymentAmount: 12000,
          lastPaymentDate: '2024-01-05',
          maintenanceRequests: 2
        };
        setStatsData(mockData);
      } catch (error) {
        console.error('Error fetching tenant stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantStats();
  }, []);

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date strings
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout
      navbar={<TenantNavbar />}
      sidebar={<TenantSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your accommodation and payments from your personalized dashboard.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Next Rent Due"
            value={statsData ? formatDate(statsData.rentDueDate) : '-'}
            icon={<Calendar className="w-5 h-5" />}
            description="Mark your calendar"
            isLoading={isLoading}
          />

          <StatsCard
            title="Last Payment"
            value={statsData ? formatCurrency(statsData.lastPaymentAmount) : '-'}
            icon={<CreditCard className="w-5 h-5" />}
            description={`Paid on ${statsData ? formatDate(statsData.lastPaymentDate) : '-'}`}
            isLoading={isLoading}
          />

          <StatsCard
            title="Maintenance Requests"
            value={statsData?.maintenanceRequests || 0}
            icon={<Wrench className="w-5 h-5" />}
            description="Active requests"
            isLoading={isLoading}
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Room Details Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Room</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View details about your current accommodation and amenities.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/tenant/room'}>
              View Details
            </Button>
          </Card>

          {/* Payments Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rent Payment</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View payment history and make rent payments securely.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/tenant/payments'}>
              Manage Payments
            </Button>
          </Card>

          {/* Maintenance Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Maintenance</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Submit and track maintenance requests for your room.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/tenant/maintenance'}>
              Submit Request
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
