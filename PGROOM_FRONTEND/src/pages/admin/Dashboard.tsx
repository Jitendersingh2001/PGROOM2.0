import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStatsDashboard from '@/components/admin/AdminStatsDashboard';

/**
 * AdminDashboard - Comprehensive admin dashboard with system analytics
 */
const AdminDashboard = () => {
  return (
    <DashboardLayout
      navbar={<AdminNavbar />}
      sidebar={<AdminSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-indigo-700 dark:from-primary dark:via-blue-500 dark:to-indigo-600 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative px-8 py-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-blue-100 text-base font-medium mt-1">
                    System overview, analytics, and management controls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <AdminStatsDashboard />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
