import { useAuth } from "@/contexts/AuthContext";

const TenantDashboard = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[hsl(var(--background))] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tenant Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">My Room</h2>
            <p className="text-gray-600 dark:text-gray-300">
              View details about your current accommodation.
            </p>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Rent Payments</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track your rent payment history.
            </p>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--background-light-dark))] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Maintenance Requests</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Submit and track maintenance requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
