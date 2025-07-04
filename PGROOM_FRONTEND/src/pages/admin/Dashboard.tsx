import React, { memo } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStatsDashboard from '@/components/admin/AdminStatsDashboard';

/**
 * AdminDashboard - Main dashboard page for system administrators
 *
 * This component uses the DashboardLayout for consistent UI and provides
 * system-wide oversight and management capabilities.
 */
const AdminDashboard = () => {
  const { userRole } = useAuth();

  // Dashboard content with admin statistics
  const DashboardContent = memo(() => (
    <div className="w-full max-w-[98%] mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="w-8 h-8 text-white">👨‍💼</div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                  Complete system oversight and management
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-6 h-6 text-white mb-2">🏢</div>
                <h3 className="text-white font-semibold">System Control</h3>
                <p className="text-blue-100 text-sm">Full administrative access</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-6 h-6 text-white mb-2">👥</div>
                <h3 className="text-white font-semibold">User Management</h3>
                <p className="text-blue-100 text-sm">Manage all users & roles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="w-6 h-6 text-white mb-2">📊</div>
                <h3 className="text-white font-semibold">Analytics</h3>
                <p className="text-blue-100 text-sm">System-wide insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Dashboard */}
      <AdminStatsDashboard />
    </div>
  ));

  return (
    <DashboardLayout
      navbar={<AdminNavbar />}
      sidebar={<AdminSidebar />}
    >
      <DashboardContent />
    </DashboardLayout>
  );
};

export default AdminDashboard;
