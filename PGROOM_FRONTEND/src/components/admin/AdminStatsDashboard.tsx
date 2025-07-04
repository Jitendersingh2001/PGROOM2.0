import React, { useEffect, useState } from 'react';
import { Building2, Users, UserCheck, CreditCard, TrendingUp, Activity, Database, Shield } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { cn } from '@/lib/utils';

interface AdminStatsDashboardProps {
  className?: string;
}

/**
 * AdminStatsDashboard - A dashboard component displaying system-wide statistics for admins
 *
 * This component is designed for the admin dashboard page to show overall system metrics
 * including all properties, users, and system health.
 */
const AdminStatsDashboard: React.FC<AdminStatsDashboardProps> = ({
  className,
}) => {
  // State for admin dashboard data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [systemStats, setSystemStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalOwners: 0,
    totalTenants: 0,
    totalPayments: 0,
    systemHealth: 100,
    activeConnections: 45,
    systemUptime: '99.9%'
  });

  // Simulate data fetching - In real implementation, this would call admin-specific APIs
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API calls
        setSystemStats({
          totalProperties: 127,
          totalUsers: 284,
          totalOwners: 45,
          totalTenants: 239,
          totalPayments: 1250,
          systemHealth: 98.5,
          activeConnections: 67,
          systemUptime: '99.9%'
        });
      } catch (err) {
        console.error('Admin stats fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main System Stats */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor the entire PropertyHub system from a single dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Properties"
            value={systemStats.totalProperties}
            icon={<Building2 className="w-5 h-5" />}
            description="System-wide properties"
            change={12.5}
            changeTimeframe="vs last month"
            isLoading={isLoading}
            className="border-l-4 border-l-blue-500"
          />

          <StatsCard
            title="Total Users"
            value={systemStats.totalUsers}
            icon={<Users className="w-5 h-5" />}
            description="All registered users"
            change={8.2}
            changeTimeframe="vs last month"
            isLoading={isLoading}
            className="border-l-4 border-l-green-500"
          />

          <StatsCard
            title="Property Owners"
            value={systemStats.totalOwners}
            icon={<UserCheck className="w-5 h-5" />}
            description="Active property owners"
            change={5.1}
            changeTimeframe="vs last month"
            isLoading={isLoading}
            className="border-l-4 border-l-purple-500"
          />

          <StatsCard
            title="Tenants"
            value={systemStats.totalTenants}
            icon={<Users className="w-5 h-5" />}
            description="Active tenant accounts"
            change={15.3}
            changeTimeframe="vs last month"
            isLoading={isLoading}
            className="border-l-4 border-l-orange-500"
          />
        </div>
      </div>

      {/* Financial & System Health Stats */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Financial & System Health
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Payments"
            value={new Intl.NumberFormat('en-IN').format(systemStats.totalPayments)}
            icon={<CreditCard className="w-5 h-5" />}
            description="Successful transactions"
            change={22.8}
            changeTimeframe="vs last month"
            isLoading={isLoading}
            iconClassName="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />

          <StatsCard
            title="System Health"
            value={`${systemStats.systemHealth}%`}
            icon={<Activity className="w-5 h-5" />}
            description="Overall system status"
            change={0.2}
            changeTimeframe="vs last week"
            isLoading={isLoading}
            iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />

          <StatsCard
            title="Active Connections"
            value={systemStats.activeConnections}
            icon={<TrendingUp className="w-5 h-5" />}
            description="Current user sessions"
            isLoading={isLoading}
            iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />

          <StatsCard
            title="System Uptime"
            value={systemStats.systemUptime}
            icon={<Shield className="w-5 h-5" />}
            description="This month's availability"
            isLoading={isLoading}
            iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Management
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage all users, roles, and permissions across the system.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Manage Users
            </button>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Monitoring
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monitor system performance, logs, and database health.
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              View Monitoring
            </button>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Configure security policies, access controls, and audit logs.
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Security Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsDashboard;
