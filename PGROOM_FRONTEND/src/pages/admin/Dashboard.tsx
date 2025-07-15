import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

/**
 * AdminDashboard - Clean and simple admin dashboard
 */
const AdminDashboard = () => {
  return (
    <DashboardLayout
      navbar={<AdminNavbar />}
      sidebar={<AdminSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto p-6">
        {/* Simple Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to the admin panel
          </p>
        </div>

        {/* Clean Content Area */}
        <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dashboard Content Cleared
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The admin dashboard has been cleaned and is ready for new content.
            </p>
            <div className="flex justify-center">
              <div className="text-6xl opacity-20">
                🏢
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
