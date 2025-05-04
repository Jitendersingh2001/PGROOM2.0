import OwnerNavbar from "@/components/owner/OwnerNavbar";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { memo } from "react";
import { Home, Users, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * OwnerDashboard - Dashboard page for property owners
 *
 * This component uses the DashboardLayout for consistent UI across different dashboards
 */
const OwnerDashboard = () => {
  const navigate = useNavigate();

  // Dashboard content with memoized card components for performance
  const DashboardContent = memo(() => (
    <div className="mx-auto w-full max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Owner Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="My Properties"
          description="Manage your properties and rooms."
          icon={<Home className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/owner/properties')}
        />

        <DashboardCard
          title="Tenant Management"
          description="Manage your tenants and applications."
          icon={<Users className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/owner/tenants')}
        />

        <DashboardCard
          title="Financial Overview"
          description="Track rent payments and expenses."
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/owner/payments')}
        />
      </div>
    </div>
  ));

  return (
    <DashboardLayout
      navbar={<OwnerNavbar />}
      sidebar={<OwnerSidebar />}
    >
      <DashboardContent />
    </DashboardLayout>
  );
};

export default OwnerDashboard;
